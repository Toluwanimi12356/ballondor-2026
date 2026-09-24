# Candidate video assets

The public clips are trimmed from the supplied official nominee presentation `video_2026-09-23_10-31-47.mp4` (720×1280, H.264/AAC, 25 fps, 529.536 seconds). Each clip starts on a stable, legible full-name cover for its nominee and ends immediately before the first frame of the following transition or nominee. Clip lengths vary to match the actual presentation; none is forced to a fixed duration. Posters are 720×1280 stills taken from each player's full-name cover. The original presentation remains outside `public/`.

| Player | Source start | Source end | Duration | Output | Resolution / codecs | Size | Poster frame | Poster | Audio |
|---|---:|---:|---:|---|---|---:|---:|---|---|
| Harry Kane | 03:00.0 | 03:12.0 | 12.000 s | `/videos/players/harry-kane.mp4` | 720×1280 · H.264/AAC | 4,729,225 B | 03:00.5 | `/images/video-posters/harry-kane.jpg` | Preserved |
| Rodri | 06:29.0 | 06:42.0 | 13.000 s | `/videos/players/rodri.mp4` | 720×1280 · H.264/AAC | 4,228,841 B | 06:31.0 | `/images/video-posters/rodri.jpg` | Preserved |
| Kylian Mbappé | 04:26.5 | 04:39.5 | 13.000 s | `/videos/players/kylian-mbappe.mp4` | 720×1280 · H.264/AAC | 4,358,121 B | 04:28.5 | `/images/video-posters/kylian-mbappe.jpg` | Preserved |
| Lamine Yamal | 08:31.5 | 08:43.5 | 12.000 s | `/videos/players/lamine-yamal.mp4` | 720×1280 · H.264/AAC | 5,530,063 B | 08:33.5 | `/images/video-posters/lamine-yamal.jpg` | Preserved |
| Lionel Messi | 04:45.5 | 04:56.5 | 11.000 s | `/videos/players/lionel-messi.mp4` | 720×1280 · H.264/AAC | 2,827,454 B | 04:46.0 | `/images/video-posters/lionel-messi.jpg` | Preserved |
| Ousmane Dembélé | 00:56.5 | 01:09.5 | 13.000 s | `/videos/players/ousmane-dembele.mp4` | 720×1280 · H.264/AAC | 4,658,787 B | 00:58.5 | `/images/video-posters/ousmane-dembele.jpg` | Preserved |
| Khvicha Kvaratskhelia | 03:17.5 | 03:28.5 | 11.000 s | `/videos/players/khvicha-kvaratskhelia.mp4` | 720×1280 · H.264/AAC | 3,701,963 B | 03:18.0 | `/images/video-posters/khvicha-kvaratskhelia.jpg` | Preserved |
| Michael Olise | 05:18.5 | 05:31.5 | 13.000 s | `/videos/players/michael-olise.mp4` | 720×1280 · H.264/AAC | 4,382,411 B | 05:20.5 | `/images/video-posters/michael-olise.jpg` | Preserved |

Posters use the first settled title-card frame where the full player name and nomination count are both visible; for the five updated cards that is after the number’s `NOMINATIONS` label animates in. Clips are served only from player profile pages, with `preload="none"`; homepage candidate cards use the complete poster stills (kept at the 9:16 source ratio) and do not request MP4 files. Profile videos start muted and provide play/pause, seek, sound, and fullscreen controls. Browser-dependent autoplay and mobile fullscreen behavior still require real-device verification.
