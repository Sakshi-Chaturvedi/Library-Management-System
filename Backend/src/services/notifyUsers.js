const cron = require("node-cron");
// const borrowModel = require("../models/borrowModel");
const sendEmail = require("../utils/sendEmail");
const borrowModel = require("../models/borrow.model");

const notifyUsers = () => {
  cron.schedule("0 9 * * *", async () => {
    try {
      const today = new Date();

      const borrows = await borrowModel
        .find({ returned: false })
        .populate("user")
        .populate("book");

      for (const borrow of borrows) {
        const dueDate = new Date(borrow.borrowDate);
        dueDate.setDate(dueDate.getDate() + 7); // 7 days borrow limit

        const timeDiff = dueDate - today;

        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysLeft <= 1) {
          await sendEmail({
            email: borrow.user.email,
            subject: "Library Book Return Reminder",
            message: `Reminder: Please return the book "${borrow.book.title}" soon.`,
          });
        }
      }

      console.log("Reminder emails sent successfully");
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = notifyUsers;