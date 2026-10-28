const express = require("express");
const router = express.Router();
const Book = require("../models/book");
router.post("/", async (req, res) => {
    const { title, author, category } = req.body;
    if (!title || !author || !category) {
        return res.status(400).json({
            message: "Title, author and category are required"
        });
    }
    const book = new Book({
        title,
        author,
        category
    });
    await book.save();
    res.status(201).json(book);
});
router.get("/", async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const santpage = page > 1 ? page : 1;
    const santLimit = limit < 1 ? 10 : limit;
    const skip = (santpage - 1) * santLimit;
    const books = await Book.find().sort({ createdAt: -1 }).skip(skip).limit(santLimit);
    const totalbook = await Book.countDocuments();
    const totalpages = Math.ceil(totalbook / santLimit);
    res.status(200).json({
        success: true,
        metadata: {
            page: santpage,
            limit: santLimit,
            totalModel: totalbook,
            totalpages: totalpages
        },
        data: books
    });
});
router.patch("/:id", async (req, res) => {
    const id = req.params.id;
    const book = await Book.findById(id);
    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }
    const { title, author, category } = req.body;
    if (title) {
        book.title = title;
    }
    if (author) {
        book.author = author;
    }
    if (category) {
        book.category = category;
    }
    await book.save();
    res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: book
    });
});
module.exports = router;
