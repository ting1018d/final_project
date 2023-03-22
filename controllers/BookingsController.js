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
        session : req.body.session},function(err, result) {
            if (err) throw err;
            console.log (result);
            if (result !== null)
             {errors.push({text: "Session already booked"});
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
                      userID : res.locals.user._id,};
                      new Booking(newBooking).save().then(() => {
                      req.flash("success_msg", "Booking Added!");
                      res.redirect("/");
                      });
                };
            });
    
//    console.log("errors =>", errors);
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
    let errors = [];
    let save_booking_id = [];
    save_booking_id.push(req.params.id);
    console.log(save_booking_id); 
//    Booking.deleteOne ({ _id: req.params.id})
//    .then();

    console.log("facility ", req.body.facility);
    console.log("booking date ", req.body.bookingDate);
    console.log("session ", req.body.session);
    Booking.findOne ({facility : req.body.facility,    
        bookingDate : req.body.bookingDate, 
        session : req.body.session},function(err, result) {
            if (err) throw err;
            console.log (result);
            if (result !== null)
             {
//                edit_error_msg += "Session already booked";
//                req.flash("error_msg", edit_error_msg);
//                res.redirect("/bookings/edit/"+booking._id);
    
                errors.push({text: "Session already booked"});
                res.render("bookings/edit", {
                errors : errors,
                facility : req.body.facility,
                bookingDate : req.body.bookingDate,
                session : req.body.session,  

                });
             }
            else
                {
                    console.log("saved_booking_id ",save_booking_id);
                    Booking.findOne({ _id: save_booking_id})
                    .then(booking => {
                        console.log(booking);
                        booking.facility = req.body.facility;
                        booking.bookingDate = req.body.bookingDate;
                        booking.session = req.body.session;
                        booking.save().
                        then(()=> {
                        req.flash("success_msg", "Booking updated !");
                        res.redirect('/bookings');    
                        });
//                    Booking.deleteOne ({ _id: save_booking_id})
//                    .then(
//                        console.log("old booking deleted")
//                    );

//                    const newBooking = {
//                      facility : req.body.facility,
//                      bookingDate : req.body.bookingDate,
//                      session : req.body.session,
//                      userID : res.locals.user._id,};
//                      new Booking(newBooking).save().then(() => {
//                      req.flash("success_msg", "Booking Updated!");
//                      res.redirect("/");
//                      });

                    });
                };
        });
    }
