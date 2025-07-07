# get_transcript.py
import sys
import json
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled

video_id = sys.argv[1]

try:
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    text = " ".join([entry["text"] for entry in transcript])
    print(json.dumps({"transcript": text}))
except TranscriptsDisabled:
    print(json.dumps({"error": "Transcripts are disabled for this video."}))
except Exception as e:
    print(json.dumps({"error": str(e)}))
