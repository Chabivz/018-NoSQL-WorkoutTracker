const router = require("express").Router();
const { Workout } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const workouts = await Workout.aggregate([
      {
        $addFields: {
          totalDuration: {
            $sum: "$exercise.duration"
          },
        },
      },
    ]);
    res.json(workouts)
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { body } = req; 
    const { id } = req.params;
    await Workout.findByIdAndUpdate(id, {
      $push: {
        exercises: body,
      }
    })
  } catch (err) {
    res.status(400).json({data: error})
  }
  
})

// Get 
router.post("/", async ({ body }, res) => {
    try { 
      console.log(body)
      const newWorkout = await Workout.create(body);
      res.json(newWorkout);
    } catch (err) {
      
      res.json(err);
    }
});

router.get("/range", async (req, res) => {
  try {
    const today = new Date(Date.now());
    const sevenDays = new Date.now();
    sevenDays.setDate(sevenDaysAgo.getDate() - 7);
    const range = await Workout.find({
      day: {
        $gte: sevenDays,
        $lte: today
      },
    });
    const response = range.map((workout, i) => {
      const { id, day, exercises } = workout;
      const withTotalDuration = {
        id,
        day,
        exercises: workout.exercises.reduce(
          (acc, cur) => acc + cur.totalDuration,
          0
        ),
      };
      return withTotalDuration;
    });
    res.json(response);
  } catch (err) {
    res.json(err)
  }
});

module.exports = router;
