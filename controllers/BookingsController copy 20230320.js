import Booking from "../models/booking.js";

export const getBookings = (req, res) => {
//    console.log("user id", res.locals.user._id);
    Booking.find({userID: res.locals.user._id})
        .lean()
        .sort({bookingDate: "desc"})
        .then(bookings => {
//            console.log(bookings);
            //go to template "ideasIndex" with table ideas
            res.locals.bookings = bookings;
            res.render("bookings/bookingsIndex");
        });
}


export const getAddBookings = (req, res) => {
//    console.log("before render bookings/add");
    res.render("bookings/add");
}

export const postAddBookings = (req, res) => {
    let errors = [];
    if (!req.body.facility) {
//        console.log("Please add a facility");
        errors.push({text: "Please add a facility"});
    }
    if (!req.body.bookingDate) {
//        console.log("Please add a date");
        errors.push({text: "Please add a date"});
    }
    if (!req.body.session) {
//        console.log("Please add a session");
        errors.push({text: "Please add a session"});
    }

    if (errors.length > 0) {
        res.render("bookings/add", {
            errors : errors,
            facility : req.body.facility,
            bookingDate : req.body.bookingDate,
            session : req.body.session,
        });
    }
    else
    {
    console.log("facility : ", req.body.facility);
    console.log("booking date : ", req.body.bookingDate);
    console.log("session : ", req.body.session);
    
    Booking.findOne ({facility : req.body.facility,    
        bookingDate : req.body.bookingDate, 
        session : req.body.session})
        .then(bookings => {
            console.log(bookings);
            if (bookings !== null)
            {errors.push({text: "Session already booked"});} 
        });

    console.log(errors);
    if (errors.length > 0)
        {
        res.render("bookings/add", {
            errors : errors,
            facility : req.body.facility,
            bookingDate : req.body.bookingDate,
            session : req.body.session,  
            });
        }
      else
        {
        const newBooking = {
          facility : req.body.facility,
          bookingDate : req.body.bookingDate,
          session : req.body.session,
          userID : res.locals.user._id,
          remarks : "client booking",
        };
        new Booking(newBooking).save().then(() => {
          req.flash("success_msg", "Booking Added!");
          res.redirect("/");
        });
        }
    }          
}
    
export const deleteBookings = (req,res) => {
    Booking.deleteOne ({ _id: req.params.id})
    .then(() => {
        req.flash("error_msg", "Booking Deleted !");
        res.redirect("/bookings")});
}

export const getEditBookings = (req,res) => {
    Booking.findOne ({ _id : req.params.id})
        .lean()
        .then((booking) => {
            res.render("bookings/edit", {booking: booking});
});
}

export const putEditBookings= (req, res) => {
    Booking.findOne({
        _id: req.params.id,
    }).then(booking => {
        console.log("result", result);
        let edit_error_msg = "";
        if (!req.body.facility) {
            edit_error_msg += "please add a facility." ;
        }
        if (!req.body.bookingDate) {
            edit_error_msg += "please add a date.";
        }
        if (!req.body.session) {
            edit_error_msg += "please add a session.";
        }
        console.log("edit_error_msg");
        if (edit_error_msg) {
            req.flash("error_msg", edit_error_msg);
            res.redirect("/bookings/edit/"+booking._id);
        } else
        {
        booking.facility = req.booking.facility;
        booking.bookingDate = req.body.bookingDate;
        booking.save().then(()=> {
            req.flash("success_msg", "Booking updated !");
            res.redirect('/bookings');
        });
        }
    });
}
