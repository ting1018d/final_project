import Booking from "../models/booking.js";

export const getBookings = (req, res) => {
//    console.log("user id", res.locals.user._id);
    Booking.find({userID: res.locals.user._id})
        .lean()
        .sort({bookingDate: 1, session: 1})
        .then(bookings => {
//            console.log(bookings);
            //go to template "ideasIndex" with table ideas
            res.locals.bookings = bookings;
            res.render("bookings/bookingsIndex",{name:res.locals.user.name});
        });
}


export const getAddBookings = (req, res) => {
//    console.log("before render bookings/add");
    res.render("bookings/add");
}

export const postAddBookings = (req, res) => {
    let bookingRemarks ="";
    console.log("admin :",res.locals.admin);
    if (res.locals.admin) {
        bookingRemarks = "admin booking"
    } else {
        bookingRemarks = "client booking";
    };
    let errors = [];
    if (!req.body.facility) {
        errors.push({text: "Please add a facility"});
    }
    if (!req.body.bookingDate) {
        errors.push({text: "Please add a date"});
    }
    if (!req.body.session) {
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
                      userID : res.locals.user._id,
                      remarks : bookingRemarks,
                      userEmail : res.locals.user.email,};
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

//   let edit_error_msg = "";
//    if (!req.body.facility) {
//        edit_error_msg += "please add a facility." ;
//    }
//    if (!req.body.bookingDate) {
//        edit_error_msg += "please add a booking date.";
//    }
//    if (!req.body.session) {
//        edit_error_msg += "please add a session.";
//    }
//    if (edit_error_msg) {
//        req.flash("error_msg", edit_error_msg);
//        console.log("edit error", edit_error_msg);
//        console.log ("req.params._id", save_booking_id);
//        res.redirect("/bookings/edit/"+save_booking_id);
//    }
//    else
    if (!req.body.facility) {
        errors.push({text: "Please add a facility"});
    }
    if (!req.body.bookingDate) {
        errors.push({text: "Please add a date"});
    }
    if (!req.body.session) {
        errors.push({text: "Please add a session"});
    }
    if (errors.length > 0) {
        res.render("bookings/edit", {
            errors : errors,
            facility : req.body.facility,
            bookingDate : req.body.bookingDate,
            session : req.body.session,
        });
    }
    else
    {
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
                        booking.remarks = "Client booking";
                        booking.userEmail = res.locals.user.email;  
                        booking.save().
                        then(()=> {
                        req.flash("success_msg", "Booking updated !");
                        res.redirect('/bookings');    
                        });

                    });
                };
        });
    }
}

export const getRecords = (req, res) => {
        Booking.aggregate (
            [
                {
                  '$lookup': {
                    'from': 'users', 
                    'localField': 'userEmail', 
                    'foreignField': 'email', 
                    'as': 'result'
                  }
                }, {
                  '$unwind': {
                    'path': '$result', 
                    'preserveNullAndEmptyArrays': true
                  }
                }
              ])
            .then(records => {
            res.render("bookings/records",{records: records})
        }); 
    }

export const getAdminBookings = (req, res) => {
    res.render("bookings/admin");
}

export const postAdminBookings = (req, res) => {
    let i = 0;
    console.log(req.body.facility);
    const date1 = new Date(req.body.maintStart);
    const date2 = new Date(req.body.maintEnd);
    do 
    { 
        console.log(date1, " - ", date2);
        i =  0;
        for (let i = 1; i <= 3; i++) {
            console.log(req.body.facility, " ", i, " ", date1);
            const newBooking = {
                facility : req.body.facility,
                bookingDate : date1.setDate(date1.getDate()),
                session : i,
                userID : res.locals.user._id,
                remarks : "Maintenance",
                userEmail : res.locals.user.email,};
                new Booking(newBooking).save().then(() => {
                
                });
        }       
        date1.setDate(date1.getDate()+1);
    }
    while (date1 <= date2 & i < 10);
//    console.log(req.body.maintStart);
//    console.log(req.body.maintStart.setDate(req.body.maintStart.getDate() + 1));
//    console.log(req.body.maintEnd);
    req.flash("success_msg", "Maintenance Bookings Added!");
    res.redirect("/bookings/admin");
}