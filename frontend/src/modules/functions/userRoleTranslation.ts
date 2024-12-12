import { UserRole } from "../../services/usersApi"

export const userRoleToSlovenian = (role: UserRole) => {
    if(role == UserRole.UNASSIGNED)
        return "Nedodeljen";

    if(role == UserRole.EMPLOYEE)
        return "Zaposleni";

    if(role == UserRole.MANAGEMENT)
        return "Vodstvo";

    return "Neznano"
}
