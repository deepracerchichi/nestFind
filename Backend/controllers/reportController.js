import Report from "../models/report.js";

// GET /api/reports - moderator only
export const getReports = async (req, res) => {
    try {
        const reports = await Report.find({ status: "open" })
            .populate("listing", "title")
            .populate("reportedBy", "username email")
            .sort({ createdAt: 1 });
        res.status(200).json({ reports, total: reports.length });
    } catch (e) {
        console.error("Error getting reports", e);
        res.status(500).json({message: "Server error"});
    }
}

// PATCH /api/reports/:id - moderator only
export const resolveReport = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["resolved", "dismissed"].includes(status)) {
            return res.status(400).json({message: "Status must be 'resolved' or 'dismissed'"});
        }

        const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!report) return res.status(404).json({message: "Report not found"});

        res.status(200).json({message: "Report updated", report});
    } catch (e) {
        console.error("Error resolving report", e);
        res.status(500).json({message: "Server error"});
    }
}
