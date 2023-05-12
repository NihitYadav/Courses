const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json());

const courses = JSON.parse(fs.readFileSync(`${__dirname}/courses.json`));

//FIRST
app.get("/courses", (req, res) => {
  res.status(200).json({
    status: "success",
    results: courses.kalvium.length,
    data: {
      courses,
    },
  });
});

const coursesData = require("./courses.json");

//SECOND
app.get("/courses/:course", (req, res) => {
  const courseName = req.params.course;
  const course = coursesData.kalvium.find((c) => c.course === courseName);
  if (course) {
    res.json(course);
  } else {
    res.status(404).json({ error: "Course not found" });
  }
});

//THIRD
app.get("/courses/:course/rating", (req, res) => {
  const courseName = req.params.course;
  const course = coursesData.kalvium.find((c) => c.course === courseName);

  if (course) {
    res.json({ averageRating: course.averageRating });
  } else {
    res.status(404).json({ error: "Course not found" });
  }
});

//FOURTH
app.post("/courses", (req, res) => {
  const {
    course,
    courseId,
    cohort,
    college,
    semester,
    averageRating,
    studentsVoted,
  } = req.body;

  const newCourse = {
    course,
    courseId,
    cohort,
    college,
    semester,
    averageRating,
    studentsVoted,
  };

  coursesData.kalvium.push(newCourse);

  fs.writeFile(
    "./courses.json",
    JSON.stringify(coursesData, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Error writing to file" });
      } else {
        res
          .status(201)
          .json({ message: "Course created successfully", course: newCourse });
      }
    }
  );
});

//FIFTH
app.post("/courses/:course/rating", (req, res) => {
  const courseName = req.params.course;
  const { rating } = req.body;

  const course = coursesData.kalvium.find((c) => c.course === courseName);

  if (course) {
    course.averageRating =
      (course.averageRating * course.studentsVoted + rating) /
      (course.studentsVoted + 1);
    course.studentsVoted++;

    fs.writeFile(
      "./courses.json",
      JSON.stringify(coursesData, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Error writing to file" });
        } else {
          res.json({ message: "Rating added successfully", course });
        }
      }
    );
  } else {
    res.status(404).json({ error: "Course not found" });
  }
});

//SIXTH
app.put('/courses/:course', (req, res) => {
  const courseName = req.params.course;
  const { courseId, cohort, college, semester, averageRating, studentsVoted } = req.body;

  const course = coursesData.kalvium.find((c) => c.course === courseName);

  if (course) {
    course.courseId = courseId;
    course.cohort = cohort;
    course.college = college;
    course.semester = semester;
    course.averageRating = averageRating;
    course.studentsVoted = studentsVoted;

    fs.writeFile('./courses.json', JSON.stringify(coursesData, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error writing to file' });
      } else {
        res.json({ message: 'Course modified successfully', course });
      }
    });
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
