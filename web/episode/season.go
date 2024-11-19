package episode

import (
	"dwlibrary/web"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

const SYNC_MAX = 5

var _ = web.Migrate(Show{})
var _ = web.Migrate(Season{})

type Show struct {
	Code   string `gorm:"primaryKey"`
	Title  string
	Desc   string
	Banner string
	Poster string
	Host   string
}

type Season struct {
	Show  string `gorm:"primaryKey"`
	Year  int    `gorm:"primaryKey;autoIncrement=false"`
	GqlId string
}

func (s Show) Seasons() []Season {
	return web.GetSorted(Season{Show: s.Code}, "`year` DESC")
}

func (s Show) Episodes() []Episode {
	return web.GetSorted(Episode{Show: s.Code}, "`date` DESC")
}

func (s Show) NewSeason() Season {
	max_year := 0
	_ = web.Db().Model(&Season{Show: s.Code}).Select("MAX(year)").Row().Scan(&max_year)
	szn := Season{Show: s.Code, Year: max_year + 1}
	return szn
}

func (s Show) NumSyncing() int {
	count := 0
	for _, season := range s.Seasons() {
		if season.Syncing() {
			count++
		}
	}
	return count
}

func (s Season) Episodes() []Episode {
	return web.GetSorted(Episode{Show: s.Show, Season: s.GqlId}, "`date` DESC")
}

func (s Season) Syncing() bool {
	return syncing.Get(s.GqlId)
}

func (s Season) GetShow() Show {
	return web.GetFirst(Show{Code: s.Show})
}

func AllShows() []Show {
	return web.GetSorted(Show{}, "`title` ASC")
}

func (s Season) Sync() (int, error) {
	if s.Syncing() {
		return 0, fmt.Errorf("already syncing")
	}

	syncing.Set(s.GqlId, true)
	defer func() { syncing.Set(s.GqlId, false) }()

	count := -1
	skip := 0

	for count != skip {
		gql, err := s.fetch_gql(skip)
		if err != nil {
			return count, err
		}

		count = skip
		for _, episode := range gql.Data.GetSeasonEpisodes {
			skip++
			if episode.Episode.ShouldIgnore() {
				continue
			}

			ep := episode.Episode.ToEpisode(s)
			web.Save(&ep)

			_, err := ep.SaveLink("https://www.dailywire.com/episode/" + episode.Episode.Slug)
			if err != nil {
				fmt.Printf("\x1b[91mFailed to save link\x1b[0m %s\n", err.Error())
				return count, err
			}
		}
	}

	fmt.Printf("Synced %s: %s - %d\n", s.Show, s.GqlId, skip)

	return count, nil
}

func (s Season) fetch_gql(skip int) (gql_data, error) {
	url := "https://v2server.dailywire.com/app/graphql"
	gql := gql_data{}
	client := &http.Client{}

	fmt.Printf("Fetching %s: %s - %d\n", s.Show, s.GqlId, skip)
	body := fmt.Sprintf(
		`{"query":"%s","variables":{"where":{"season":{"id":"%s"}},"first":1000,"skip":%d}}`,
		strings.ReplaceAll(graphql, "\n", "\\n"), s.GqlId, skip,
	)

	req, err := http.NewRequest("POST", url, strings.NewReader(body))
	if err != nil {
		fmt.Printf("Failed to create request: %s\n", err.Error())
		return gql, err
	}

	req.Header.Set("User-Agent", "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0")
	req.Header.Set("Accept", "*/*")
	req.Header.Set("Accept-Language", "en-US,en;q=0.5")
	req.Header.Set("content-type", "application/json")
	req.Header.Set("apollographql-client-name", "DW_WEBSITE")
	req.Header.Set("Sec-Fetch-Dest", "empty")
	req.Header.Set("Sec-Fetch-Mode", "cors")
	req.Header.Set("Sec-Fetch-Site", "same-site")
	req.Header.Set("Pragma", "no-cache")
	req.Header.Set("Cache-Control", "no-cache")
	req.Header.Set("Referer", "https://www.dailywire.com/")

	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Failed to send request: %s\n", err.Error())
		return gql, err
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Failed to read response: %s\n", err.Error())
		return gql, err
	}

	err = json.Unmarshal(data, &gql)
	if err != nil {
		fmt.Printf("Failed to unmarshal response: %s\n", err.Error())
		return gql, err
	}

	return gql, nil
}
