package episode

import "dwlibrary/web"

type Episode struct {
	Code  string `gorm:"primaryKey"`
	Title string
	Slug  string
	Show  string
	Host  string
	Date  int64
	Desc  string
	Thumb string
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

func (seg TranscriptSegment) GetEpisode() Episode {
	return Episode{Code: seg.Episode}
}

func (ep Episode) Links() []Link {
	return web.GetSorted(Link{Episode: ep.Code}, "`platform` ASC")
}

func (link Link) GetEpisode() Episode {
	return Episode{Code: link.Episode}
}
