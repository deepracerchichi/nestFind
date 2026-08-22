import Conversation from "../models/conversation.js";
import Listing from "../models/listing.js";
import Message from "../models/message.js";

// POST /api/conversations - start or get existing conversation about a listing
export const startConversation = async (req, res) => {
    try {
        const { listingId } = req.body;
        if (!listingId) {
            return res.status(400).json({message: "listingId is required"});
        }

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({message: "Listing not found"});
        }

        const sellerId = listing.postedBy.toString();

        if (sellerId === req.user.id) {
            return res.status(400).json({message: "You can't message yourself"});
        }

        let conversation = await Conversation.findOne({
            listing: listingId,
            participants: { $all: [req.user.id, sellerId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                listing: listingId,
                participants: [req.user.id, sellerId],
            });
        }

        res.status(200).json({ conversation });
    } catch (e) {
        console.error("Error starting conversation", e);
        res.status(500).json({message: "Server error"});
    }
}


// GET /api/conversations - list current user's conversations, for an inbox
export const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ participants: req.user.id })
            .populate("participants", "username email")
            .populate("listing", "title images")
            .sort({ updatedAt: -1 });

        res.status(200).json({ conversations });
    } catch (e) {
        console.error("Error getting conversations", e);
        res.status(500).json({message: "Server error"});
    }
}

// GET /api/conversations/:id/messages - history for one conversation
export const getMessages = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) return res.status(404).json({message: "Conversation not found"});

        const isParticipant = conversation.participants
            .map((id) => id.toString())
            .includes(req.user.id);
        if (!isParticipant) return res.status(403).json({message: "Not authorized"});

        const messages = await Message.find({ conversation: req.params.id })
            .sort({ createdAt: 1 });

        res.status(200).json({ messages });
    } catch (e) {
        console.error("Error getting messages", e);
        res.status(500).json({message: "Server error"});
    }
}
