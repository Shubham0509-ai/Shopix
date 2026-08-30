

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (
        [name, email, password].some((field) => field?.trim() === "") // field? (Optional Chaining): Prevents crashes if field is null or undefined.
    ) {
        throw new ApiError(400, "All fields are required")
    };
};

export const login = async (req, res) => {
    res.send("Login end point");
};

export const logout = async (req, res) => {
    res.send("Logout end point");
};