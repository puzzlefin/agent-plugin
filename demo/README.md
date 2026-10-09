# Puzzle in ChatGPT demo

Reusable 1280×720 motion-design wrapper for the OpenAI review walkthrough and later launch clips.

- `index.html` is the branded composition.
- `walkthrough.mp4` is an optional real screen capture. Without it, the composition renders a polished storyboard fallback.
- `walkthrough-review.mp4` is the full, unedited product capture used by review mode.
- `narration.txt` is the voiceover script.
- `review-narration.txt` is the factual, intermittent cue sheet for the real review walkthrough.
- `voiceover.mp3` and rendered videos are generated artifacts and are intentionally ignored.

The 46-second timeline uses Puzzle's current public-site visual language: warm off-white, black,
mint green, lilac, oversized type, rounded product frames, and restrained motion.

Render the composition with the `browser-demo-recorder` skill, then mux narration and music with
FFmpeg. The final OpenAI review URL belongs in
`extensions.com.openai.review.demo_recording_url` in the directory manifest.

For a submission recording, load `index.html?mode=review&walkthroughDuration=SECONDS`.
Review mode keeps the branded opener and closing card but gives the genuine product capture the
full 1280×720 stage so prompts and results remain readable. It intentionally has no mock fallback.
