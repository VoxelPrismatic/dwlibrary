package htmx

import (
	"dwlibrary/site/data"
	"dwlibrary/site/template"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"
)

var syncing map[string]int64 = make(map[string]int64)

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

func (ep gql_episode) GetSlug(show string) string {
	r := regexp.MustCompile("[Ee][Pp](.|-) ?([0-9]+)")
	matches := r.FindStringSubmatch(ep.Title)
	if len(matches) == 0 {
		matches = r.FindStringSubmatch(ep.Slug)
	}
	if len(matches) == 0 {
		return ep.Id
	}

	i := matches[2]
	if len(i) < 2 {
		i = "0" + i
	}

	return show + "-" + i
}

var ignore_tags []string = []string{
	"[member exclusive]",
	"[ad free]",
}

func thumb_exists(thumb string) bool {
	if thumb == "" {
		return false
	}

	if strings.HasPrefix(thumb, "/src/") {
		thumb = "./site/content/" + thumb[len("/src/"):]
	}

	stat, err := os.Stat(thumb)
	if err != nil {
		return false
	}

	if stat.Size() == int64(0) {
		return false
	}

	return true
}

func fill_episodes(gql_id string, show string) (int, error) {
	diff := time.Now().Unix() - syncing[show+"-"+gql_id]
	if diff < 60 {
		fmt.Printf("Skipping %s - %s - %d seconds\n", gql_id, show, diff)
		return 0, fmt.Errorf("already syncing")
	}

	syncing[show+"-"+gql_id] = time.Now().Unix()

	db, err := data.Connect()
	if err != nil {
		return 0, err
	}

	count := 0
	skip := 0
	url := "https://v2server.dailywire.com/app/graphql"

	client := &http.Client{}
	for {
		fmt.Printf("Fetching %s: %s - %d\n", show, gql_id, skip)
		body := fmt.Sprintf(
			`{"query":"%s","variables":{"where":{"season":{"id":"%s"}},"first":1000,"skip":%d}}`,
			strings.ReplaceAll(graphql, "\n", "\\n"), gql_id, skip,
		)

		req, err := http.NewRequest("POST", url, strings.NewReader(body))
		if err != nil {
			fmt.Printf("Failed to create request: %s\n", err.Error())
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
			fmt.Printf("Failed to send request: %s\n", err.Error())
			return 0, err
		}

		episodes, err := io.ReadAll(resp.Body)
		if err != nil {
			fmt.Printf("Failed to read response: %s\n", err.Error())
			return 0, err
		}

		gql := gql_resp{}
		err = json.Unmarshal(episodes, &gql)
		if err != nil {
			fmt.Printf("Failed to unmarshal response: %s\n", err.Error())
			return 0, err
		}

		count = skip

		for _, episode := range gql.Data.GetSeasonEpisodes {
			skip++
			ep := episode.Episode
			if episode.Episode.Status != "PUBLISHED" {
				continue
			}

			if ep.ShouldIgnore() {
				continue
			}

			d, err := time.Parse("2006-01-02T15:04:05.9999999Z", ep.CreatedAt)
			if err != nil {
				d = time.Unix(0, 0)
			}

			existing := data.Link{}
			db.Where("name = ?", ep.GetSlug(show)).First(&existing)

			img_url := existing.Thumb

			if !thumb_exists(existing.Thumb) {
				img_url, err = UploadImageFromUrl(ep.Image)
				if err != nil {
					fmt.Printf("Failed to upload image: %s\n", err.Error())
					continue
				}
			}

			link := data.Link{
				Name:            ep.GetSlug(show),
				GraphQLSeriesID: gql_id,
				Series:          show,
				Title:           ep.Title,
				Date:            d.Unix(),
				Description:     ep.Description,
				LinkDW:          "https://www.dailywire.com/episode/" + ep.Slug,
				Thumb:           img_url,
			}

			db.Save(&link)
		}

		if count == skip {
			syncing[show+"-"+gql_id] = 0
			fmt.Printf("Finished %s\n", show)
			return skip, nil
		}
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

func HtmxSeriesSyncRouter(user data.UserEntry, w http.ResponseWriter, r *http.Request) {
	if !user.IsAdmin {
		w.Header().Set("X-Auth-Reason", "Not an admin")
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(r.URL.Path[len("/htmx/series-sync/"):], "/")
	if len(parts) != 2 {
		http.Error(w, "Bad request\nformat: /htmx/series-sync/SHOW/GQLid", http.StatusBadRequest)
		return
	}

	show := parts[0]
	gql_id := parts[1]
	db, err := data.Connect()
	if err != nil {
		http.Error(w, "SqlConnect(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	card := data.SiteDwSeriesEntry{}
	db.Model(&card).Where("show = ?", show).Find(&card)

	link := data.SiteDwSeriesLinkEntry{}
	db.Model(&link).Where("show = ? AND link = ?", show, gql_id).Find(&link)

	if link.Show == "" {
		http.Error(w, fmt.Sprintf("Not found\n(check that the gql_id `%s' exists in the series `%s')", gql_id, show), http.StatusNotFound)
		return
	}

	sync_id := link.Show + "-" + link.Link
	timestamp, ok := syncing[sync_id]
	if !ok {
		go fill_episodes(gql_id, show)
		timestamp = 1
	}

	if timestamp > 0 {
		w.Header().Set("HX-Retarget", fmt.Sprintf("#%s-%d", show, link.Placement))
		err = template.DwSeriesLink(user, card, link, true).Render(r.Context(), w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	delete(syncing, sync_id)
	w.Header().Set("HX-Retarget", fmt.Sprintf("#%s-%d", show, link.Placement))
	err = template.DwSeriesLink(user, card, link, false).Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
