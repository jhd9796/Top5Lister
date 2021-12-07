const Top5List = require("../models/top5list-model");
const auth = require("../auth");
const User = require("../models/user-model");

createTop5List = (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: "You must provide a Top 5 List",
        });
    }

    const top5List = new Top5List(body);
    console.log("creating top5List: " + JSON.stringify(top5List));
    if (!top5List) {
        return res.status(400).json({ success: false, error: err });
    }

    top5List
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                top5List: top5List,
                message: "Top 5 List Created!",
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error,
                message: "Top 5 List Not Created!",
            });
        });
};

//HD
findUserEmailFromReq = async (req) => {
    let userId = auth.getUserId(req);
    try {
        const existingUser = await User.findOne({ _id: userId });
        if (existingUser) {
            console.log(
                "[top5list-controller.js:findUserEmailFromReq()] Find existing user. = " +
                existingUser.email
            );
            return existingUser.email;
        } else {
            console.log(
                "[top5list-controller.js:findUserEmailFromReq()] Cannot find existing user with id = " +
                userId
            );
            return null;
        }
    } catch (err) {
        console.log(
            "[user-control:findUserEmailFromReq()] catch error = " +
            JSON.stringify(err)
        );
        console.error(err);
        return null;
    }
};

updateTop5List = async (req, res) => {
    const body = req.body;
    console.log("updateTop5List: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: "You must provide a body to update",
        });
    }

    let userEmail = await findUserEmailFromReq(req); ///HD
    console.log(
        "[top5list-controller.js:updateTop5List()]  userEmail = " + userEmail
    ); ///HD
    console.log(
        "[top5list-controller.js:updateTop5List()]  body.ownerEmail = " + body.ownerEmail
    );

    let emailToFind = "";
    if (body.ownerEmail !== userEmail) {
        emailToFind = body.ownerEmail;
    } else {
        emailToFind = userEmail;
    }

    console.log(
        "[top5list-controller.js:updateTop5List()]  emailToFind = " + emailToFind
    );
    //HD
    Top5List.findOne(
        { _id: req.params.id, ownerEmail: emailToFind },
        (err, top5List) => {
            console.log("top5List found: " + JSON.stringify(top5List));
            if (err) {
                return res.status(404).json({
                    err,
                    message: "Top 5 List not found!",
                });
            }

            top5List.name = body.name;
            top5List.items = body.items;
            top5List.ownerEmail = body.ownerEmail;
            top5List.likes = body.likes;
            top5List.dislikes = body.dislikes;
            top5List.views = body.views;
            top5List.published = body.published;
            top5List.isListPublished = body.isListPublished;
            top5List.comments = body.comments;

            top5List
                .save()
                .then(() => {
                    console.log("SUCCESS!!!");
                    return res.status(200).json({
                        success: true,
                        id: top5List._id,
                        message: "Top 5 List updated!",
                    });
                })
        }
    );
};

deleteTop5List = async (req, res) => {
    let userEmail = await findUserEmailFromReq(req); //HD
    console.log(
        "[top5list-controller.js:deleteTop5List()]  userEmail = " + userEmail
    ); //HD

    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        if (err) {
            return res.status(404).json({
                err,
                message: "Top 5 List not found!",
            });
        }
        Top5List.findOneAndDelete({ _id: req.params.id }, () => {
            return res.status(200).json({ success: true, data: top5List });
        }).catch((err) => console.log(err));
    });
};

getTop5ListById = async (req, res) => {
    console.log(
        "[top5list-controller.js:getTop5ListById()] _id = " + req.params.id
    ); //HD
    await Top5List.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        return res.status(200).json({ success: true, top5List: list });
    }).catch((err) => console.log(err));
};

////////////////HD
getTop5Lists = async (req, res) => {
    let userEmail = await findUserEmailFromReq(req); //HD
    console.log(
        "[top5list-controller.js:getTop5Lists()]  userEmail = " + userEmail
    ); //HD

    await Top5List.find({ ownerEmail: userEmail }, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!top5Lists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Top 5 Lists not found` });
        }
        return res.status(200).json({ success: true, data: top5Lists });
    }).catch((err) => console.log(err));
};

getTop5ListsAllUser = async (req, res) => {
    await Top5List.find(
        { published: { $gte: new Date("0001-12-24T00:00:00.000Z") } },
        (err, top5Lists) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            if (!top5Lists.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `Top 5 Lists not found` });
            }
            return res.status(200).json({ success: true, data: top5Lists });
        }
    ).catch((err) => console.log(err));
};

//////////////////HD
getTop5ListPairs = async (req, res) => {
    let userEmail = await findUserEmailFromReq(req); //HD
    console.log(
        "[top5list-controller.js:getTop5ListPairs()]  userEmail = " + userEmail
    ); //HD
    await Top5List.find({ ownerEmail: userEmail }, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!top5Lists) {
            console.log("!top5Lists.length");
            return res
                .status(404)
                .json({ success: false, error: "Top 5 Lists not found" });
        } else {
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in top5Lists) {
                let list = top5Lists[key];
                let pair = {
                    _id: list._id,
                    name: list.name,
                    ownerName: list.ownerName, //HD
                    items: list.items, //HD
                    views: list.views, //HD
                    comments: list.comments,
                    likes: list.likes,
                    dislikes: list.dislikes,
                    published: list.published,
                    isListPublished: list.isListPublished
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs });
        }
    }).catch((err) => console.log(err));
};

top5listpairsAllUser = async (req, res) => {
    await Top5List.find(
        { published: { $gte: new Date("0001-12-24T00:00:00.000Z") } },
        (err, top5Lists) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            if (!top5Lists) {
                console.log("!top5Lists.length");
                return res
                    .status(404)
                    .json({ success: false, error: "Top 5 Lists not found" });
            } else {
                // PUT ALL THE LISTS INTO ID, NAME PAIRS
                let pairs = [];
                for (let key in top5Lists) {
                    let list = top5Lists[key];
                    let pair = {
                        _id: list._id,
                        name: list.name,
                        ownerName: list.ownerName, //HD
                        items: list.items, //HD
                        views: list.views, //HD
                        likes: list.likes,
                        dislikes: list.dislikes,
                        published: list.published,
                        isListPublished: list.isListPublished,
                        comments: list.comments
                    };
                    pairs.push(pair);
                }
                return res.status(200).json({ success: true, idNamePairs: pairs });
            }
        }
    ).catch((err) => console.log(err));
};

module.exports = {
    createTop5List,
    updateTop5List,
    deleteTop5List,
    getTop5Lists,
    getTop5ListPairs,
    getTop5ListById,
    top5listpairsAllUser,
    getTop5ListsAllUser,
};
