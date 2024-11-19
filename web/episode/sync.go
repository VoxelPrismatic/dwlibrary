package episode

import (
	"dwlibrary/web/common"
	"fmt"
	"regexp"
	"strings"
	"sync"
	"time"
)

type SafeSync struct {
	lock sync.Mutex
	val  map[string]bool
}

func (sync *SafeSync) Get(key string) bool {
	sync.lock.Lock()
	defer sync.lock.Unlock()
	return sync.val[key]
}

func (sync *SafeSync) Set(key string, val bool) {
	sync.lock.Lock()
	defer sync.lock.Unlock()
	sync.val[key] = val
}

var syncing = SafeSync{val: make(map[string]bool)}

type gql_data struct {
	Data gql_seasons `json:"data"`
}

type gql_seasons struct {
	GetSeasonEpisodes []gql_season_episode `json:"getSeasonEpisodes"`
}

type gql_season_episode struct {
	Id      string      `json:"id"`
	Episode gql_episode `json:"episode"`
}

type gql_episode struct {
	Id           string `json:"id"`
	Title        string `json:"title"`
	Slug         string `json:"slug"`
	Image        string `json:"image"`
	Description  string `json:"description"`
	UpdatedAt    string `json:"updatedAt"`
	ScheduleAt   string `json:"scheduleAt"`
	CreatedAt    string `json:"createdAt"`
	DiscussionId string `json:"discussionId"`
	IsLive       bool   `json:"isLive"`
	Status       string `json:"status"`
}

var ignore_tags []string = []string{
	"[member exclusive]",
	"[ad free]",
	"[bonus hour",
	"[dw+ exclusive]",
	"[member exclusvie]", // typo from walsh-1481's title
}

func (ep gql_episode) ShouldIgnore() bool {
	if ep.Status != "PUBLISHED" {
		return true
	}

	t := strings.ToLower(ep.Title)
	for _, tag := range ignore_tags {
		if strings.Contains(t, tag) {
			return true
		}
	}

	return false
}

var slug_regex = regexp.MustCompile("(?:ep(?:isode)?)(?:[-.: ])*([0-9]+)")

func (ep gql_episode) GetSlug(show string) string {
	matches := slug_regex.FindStringSubmatch(strings.ToLower(ep.Title))
	if len(matches) == 0 {
		matches = slug_regex.FindStringSubmatch(strings.ToLower(ep.Slug))
	}
	if len(matches) == 0 {
		return ep.Id
	}

	i := matches[1]
	if len(i) < 2 {
		i = "0" + i
	}

	return show + "-" + i
}

func (ep gql_episode) ToEpisode(season Season) Episode {
	date, err := time.Parse("2006-01-02T15:04:05.9999999Z", ep.CreatedAt)
	if err != nil {
		fmt.Println("\x1b[91mFailed to parse date\x1b[0m", err)
		date = time.Now()
	}

	img := common.ImageUpload{Link: ep.Image}
	err = img.Download()
	if err != nil {
		fmt.Println("\x1b[91mFailed to download image\x1b[0m", err)
	}

	return Episode{
		Code:   ep.Id,
		Title:  strings.TrimSpace(ep.Title),
		Slug:   ep.GetSlug(season.Show),
		Show:   season.Show,
		Season: season.GqlId,
		Host:   season.GetShow().Host,
		Date:   date.Unix(),
		Desc:   strings.TrimSpace(ep.Description),
		Thumb:  img.Location,
	}
}

const graphql string = `query getSeasonEpisodes($where: getSeasonEpisodesInput!, $first: Int, $skip: Int) {
    getSeasonEpisodes(where: $where, first: $first, skip: $skip) {
        id
        episode {
            id
            title
            slug
            image
            description
            updatedAt
            scheduleAt
            createdAt
            discussionId
            isLive
            status
        }
    }
}`
