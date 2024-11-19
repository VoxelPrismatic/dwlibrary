package episode

import (
	"dwlibrary/web"
	platform "dwlibrary/web/admin-platform"
	"fmt"
	"strings"
)

var _ = web.Migrate(Episode{})
var _ = web.Migrate(TranscriptSegment{})
var _ = web.Migrate(SegmentTag{})
var _ = web.Migrate(Link{})

const PAGE_LIMIT = 20

type Episode struct {
	Code   string `gorm:"primaryKey"`
	Title  string
	Slug   string
	Show   string
	Season string
	Host   string
	Date   int64
	Desc   string
	Thumb  string
}

type TranscriptSegment struct {
	Episode   string `gorm:"primaryKey"`
	Timestamp int    `gorm:"primaryKey;autoIncrement=false"`
	Title     string
	Segment   string
	Content   string
	Duration  int
}

type SegmentTag struct {
	Episode string `gorm:"primaryKey"`
	Segment int    `gorm:"primaryKey;autoIncrement=false"`
	Index   int    `gorm:"primaryKey;autoIncrement=false"`
	Type    string
	Text    string
	Link    string
}

type Link struct {
	Episode  string `gorm:"primaryKey"`
	Platform string `gorm:"primaryKey"`
	Link     string
}

type EpisodeFilter struct {
	Show        string
	Host        string
	SearchTitle string
	SearchTags  string
	SearchDesc  string
	Before      int64
	After       int64
	Page        int
	Count       int64
}

type FilterSplit struct {
	Like    []string
	NotLike []string
}

func (ep Episode) Segments() []TranscriptSegment {
	return web.GetSorted(TranscriptSegment{Episode: ep.Code}, "`timestamp` ASC")
}

func (ep Episode) Tags() []SegmentTag {
	return web.GetSorted(SegmentTag{Episode: ep.Code}, "`segment` ASC, `index` ASC")
}

func (tag SegmentTag) GetSegment() TranscriptSegment {
	return TranscriptSegment{Episode: tag.Episode, Timestamp: tag.Segment}
}

func (tag SegmentTag) GetEpisode() Episode {
	return Episode{Code: tag.Episode}
}

func (link Link) GetPlatform() platform.Platform {
	return web.GetFirst(platform.Platform{Code: link.Platform})
}

func (seg TranscriptSegment) GetEpisode() Episode {
	return Episode{Code: seg.Episode}
}

func (ep Episode) Links() []Link {
	return web.GetSorted(Link{Episode: ep.Code}, "`platform` ASC")
}

func (link Link) GetEpisode() Episode {
	return Episode{Code: link.Episode}
}

func (ep Episode) SaveLink(url string) (Link, error) {
	for _, p := range platform.AllPlatforms() {
		if p.Match(url) {
			link := Link{Episode: ep.Code, Platform: p.Code, Link: url}
			web.Save(&link)
			return link, nil
		}
	}

	return Link{Episode: ep.Code, Platform: "unknown", Link: url}, fmt.Errorf("unknown platform")
}

func (filter EpisodeFilter) Search() []Episode {
	ret := web.Db().Model(&Episode{}).Joins("LEFT JOIN segment_tags ON segment_tags.episode = episodes.code")
	if filter.Show != "" {
		ret = ret.Where("episodes.show = ?", filter.Show)
	}
	if filter.Host != "" {
		ret = ret.Where("episodes.host = ?", filter.Host)
	}

	if filter.Before != 0 {
		ret = ret.Where("episodes.date < ?", filter.Before)
	}
	if filter.After != 0 {
		ret = ret.Where("episodes.date > ?", filter.After)
	}

	splits := parse_query(filter.SearchTitle)
	for _, s := range splits.Like {
		ret = ret.Where("LOWER(episodes.title) LIKE ?", "%"+s+"%")
	}
	for _, s := range splits.NotLike {
		ret = ret.Where("LOWER(episodes.title) NOT LIKE ?", "%"+s+"%")
	}

	splits = parse_query(filter.SearchTags)
	for _, s := range splits.Like {
		ret = ret.Where("LOWER(segment_tags.text) LIKE ?", "%"+s+"%")
	}
	for _, s := range splits.NotLike {
		ret = ret.Where("LOWER(segment_tags.text) NOT LIKE ?", "%"+s+"%")
	}

	splits = parse_query(filter.SearchDesc)
	for _, s := range splits.Like {
		ret = ret.Where("LOWER(episodes.desc) LIKE ?", "%"+s+"%")
	}
	for _, s := range splits.NotLike {
		ret = ret.Where("LOWER(episodes.desc) NOT LIKE ?", "%"+s+"%")
	}

	ret.Count(&filter.Count)

	ret = ret.Offset((filter.Page - 1) * PAGE_LIMIT).Limit(PAGE_LIMIT).Order("episodes.date DESC")
	eps := []Episode{}
	ret.Find(&eps)

	return eps
}

func parse_query(query string) FilterSplit {
	like := []string{}
	not_like := []string{}
	in_str := true
	join := []string{}
	in_negate := false

	for _, q := range strings.Split(strings.ToLower(query), " ") {
		if in_str {
			if strings.HasSuffix(q, `"`) {
				q = q[:len(q)-1]
				join = append(join, q)
				q = strings.Join(join, " ")
				in_str = false
			} else {
				join = append(join, q)
				continue
			}
		} else {
			if q[0] == '-' {
				in_negate = true
				q = q[1:]
			} else {
				in_negate = false
			}

			if q[0] == '"' {
				in_str = true
				join = []string{q[1:]}
				continue
			}
		}

		if in_negate {
			not_like = append(not_like, q)
		} else {
			like = append(like, q)
		}
	}

	return FilterSplit{Like: like, NotLike: not_like}
}
