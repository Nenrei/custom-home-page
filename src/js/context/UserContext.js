import { createContext } from "react";
const UserContext = createContext({
    email: "",
    isAuthenticated: ""
});
export default UserContext;