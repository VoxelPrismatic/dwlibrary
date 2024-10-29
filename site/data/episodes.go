package data

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

/*
resp = await fetch("https://v2server.dailywire.com/app/graphql", {
    "credentials": "omit",
    "headers": {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
        "Accept": "/",
        "Accept-Language": "en-US,en;q=0.5",
        "content-type": "application/json",
        "apollographql-client-name": "DW_WEBSITE",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
    },
    "referrer": "https://www.dailywire.com/",
    "body": "{\"query\":\"query getSeasonEpisodes($where: getSeasonEpisodesInput!, $first: Int, $skip: Int) {\\n  getSeasonEpisodes(where: $where, first: $first, skip: $skip) {\\n    id\\n    episode {\\n      id\\n      title\\n      slug\\n      image\\n      description\\n      updatedAt\\n      scheduleAt\\n      createdAt\\n      discussionId\\n      isLive\\n      status\\n    }\\n  }\\n}\\n\",\"variables\":{\"where\":{\"season\":{\"id\":\"clqwfgf30qzd408863ni68awe\"}},\"first\":50,\"skip\":0}}",
    "method": "POST",
    "mode": "cors"
});
data = await resp.json()

sql = "INSERT INTO links(name, series, title, date, description, link_dw, thumb) VALUES"
for(var episode of data.data.getSeasonEpisodes) {
    episode = episode.episode
    if(!episode.title.startsWith("Ep.") || episode.title.includes("[Member Exclusive]"))
        continue
    i = episode.slug.split("-")[1];
    d = Number(new Date(episode.createdAt))
    sql += `('knowles-${i}', 'knowles', '${episode.title}', ${Math.floor(d / 1000)}, "${episode.description}", "https://www.dailywire.com/episode/${episode.slug}", "${episode.image}")`
}
*/

type gql_resp struct {
	Data gql_obj `json:"data"`
}

type gql_obj struct {
	GetSeasonEpisodes []gql_ep `json:"getSeasonEpisodes"`
}

type gql_ep struct {
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

const graphql string = "" +
	"query getSeasonEpisodes(" +
	"$where: getSeasonEpisodesInput!, " +
	"$first: Int, " +
	"$skip: Int" +
	") { " +
	"getSeasonEpisodes(where: $where, first: $first, skip: $skip) {" +
	"id " +
	"episode {" +
	"id " +
	"title " +
	"slug " +
	"image " +
	"description " +
	"updatedAt " +
	"scheduleAt " +
	"createdAt " +
	"discussionId " +
	"isLive " +
	"status " +
	"} " +
	"} " +
	"} "

func FillEpisodes(host string, series string, show string) (int, error) {
	db, err := Connect()
	if err != nil {
		return 0, err
	}

	count := 0
	skip := 0
	url := "https://v2server.dailywire.com/app/graphql"

	client := &http.Client{}
	for {
		fmt.Printf("Fetching %s: %s - %d\n", url, series, skip)
		body := fmt.Sprintf(`{"query":"%s","variables":{"where":{"season":{"id":"%s"}},"first":50,"skip":%d}}`, graphql, series, skip)
		req, err := http.NewRequest("POST", url, strings.NewReader(body))
		if err != nil {
			return 0, err
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
			return 0, err
		}

		data, err := io.ReadAll(resp.Body)
		if err != nil {
			return 0, err
		}

		gql := gql_resp{}
		err = json.Unmarshal(data, &gql)
		if err != nil {
			return 0, err
		}

		count = skip

		for _, episode := range gql.Data.GetSeasonEpisodes {
			ep := episode.Episode
			if episode.Episode.Status != "PUBLISHED" {
				continue
			}
			if strings.Contains(ep.Title, "[Member Exclusive]") {
				continue
			}
			if !strings.HasPrefix(ep.Title, "Ep.") {
				continue
			}

			i := ""
			parts := strings.Split(ep.Slug, "-")
			if len(parts) == 2 {
				i = host + "-" + parts[1]
			} else {
				parts = strings.Split(ep.Title, " ")
				i = host + "-" + parts[1]
			}
			d, err := time.Parse("2006-01-02T15:04:05.9999999Z", ep.CreatedAt)
			if err != nil {
				d = time.Unix(0, 0)
			}

			link := Link{
				Name:        i,
				Series:      show,
				Title:       ep.Title,
				Date:        d.Unix(),
				Description: ep.Description,
				LinkDW:      "https://www.dailywire.com/episode/" + ep.Slug,
				Thumb:       ep.Image,
			}

			db.Save(&link)
			skip++
		}

		if count == skip {
			return skip, nil
		}
	}
}

func FillSeries() error {
	ben := []string{
		"clqwfhdq3vpoo08345zkev0c0", // 2024
		"clcp1aft80jeh08343je8hxe1", // 2023
		"ckxyxs8k22s5d0b54zszz84j0", // 2022
		"ckjk5t562e23d0782qxj4t02m", // 2021
		"ckisrtf5t0iub07940dbjr5pq", // 2020
		"ckisrtde30ls70754ya5uwzcf", // 2019
		"ckisrtaod0mu90866tnghh9ji", // 2018
		"ckisrt8ts0kum0754ocme6fq7", // 2017
		"ckisrt7300k2407548aj7o23t", // 2016
		"ckisrt5ft0kbn07821h8bgfs4", // 2015
	}

	for _, show := range ben {
		count, err := FillEpisodes("shapiro", show, "shapiro-show")
		if err != nil {
			return err
		}
		fmt.Printf("Added %d links for %s\n", count, show)
	}

	return nil
}

/*func main() {
	err := FillSeries()
	if err != nil {
		panic(err)
	}
}*/
