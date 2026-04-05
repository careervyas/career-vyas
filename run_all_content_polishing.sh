#!/bin/bash

# Ensure we use python3
PYTHON="python3"
SCRIPT="content_polishing/scripts/batch_processor.py"

echo "Starting Career Vyas Content Polishing Pipeline..."

echo "==> [1/4] Processing Colleges..."
$PYTHON $SCRIPT --input-dir "content/App Content/Colleges" --type college_profile --delay 4.0

echo "==> [2/4] Processing Career Profiles..."
$PYTHON $SCRIPT --input-dir "content/App Content/career profile" --type career_profile --delay 4.0

echo "==> [3/4] Processing Courses..."
$PYTHON $SCRIPT --input-dir "content/App Content 2/Courses" --type course_profile --delay 4.0

echo "==> [4/4] Processing Exams..."
$PYTHON $SCRIPT --input-dir "content/App Content 2/Exams" --type exam_profile --delay 4.0

echo "Pipeline complete! Check output directory and processor.log for results."
