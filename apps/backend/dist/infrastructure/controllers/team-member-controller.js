"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_team_member_1 = __importDefault(require("../../application/use-cases/team-member/create-team-member"));
const get_team_members_1 = __importDefault(require("../../application/use-cases/team-member/get-team-members"));
const get_team_member_by_user_id_1 = __importDefault(require("../../application/use-cases/team-member/get-team-member-by-user-id"));
const team_member_1 = require("../../entities/team-member");
const update_team_member_skill_1 = __importDefault(require("../../application/use-cases/team-member/update-team-member-skill"));
const invite_or_switch_team_1 = __importDefault(require("../../application/use-cases/team-member/invite-or-switch-team"));
const delete_team_member_1 = __importDefault(require("../../application/use-cases/team-member/delete-team-member"));
const createTeamMemberController = (dependencies) => {
    const createTeamMemberController = async (httpRequest) => {
        const { userId, teamId } = httpRequest.body;
        try {
            const newTeamMember = await dependencies.createTeamMemberUseCase.execute({
                userId,
                teamId,
            });
            return {
                statusCode: 201,
                body: newTeamMember,
            };
        }
        catch (error) {
            return {
                statusCode: 400,
                body: { error },
            };
        }
    };
    const inviteOrSwitchTeamController = async (httpRequest) => {
        const { email, consentId } = httpRequest.body;
        const userId = httpRequest.userId;
        try {
            const teamOwner = await dependencies.getTeamMemberByUserIdUseCase.execute({ userId });
            if (!teamOwner) {
                throw Error("You do not have any team. You are not allowed to invite.");
            }
            const newTeamMember = await dependencies.inviteOrSwitchTeamUseCase.execute({
                invitedEmail: email,
                invitedUserIdLast4: consentId,
                newTeamId: teamOwner?.teamId,
                userId,
            });
            return {
                statusCode: 201,
                body: newTeamMember,
            };
        }
        catch (error) {
            return {
                statusCode: 400,
                body: { error },
            };
        }
    };
    const getTeamMembersByTeamIdController = async (httpRequest) => {
        try {
            let teamId = httpRequest.params.teamId;
            const userId = httpRequest.userId;
            if (!teamId) {
                return {
                    statusCode: 400,
                    body: { error: "Team ID is required" },
                };
            }
            if (teamId === team_member_1.DEFAULT_USERS_TEAM) {
                const teamMember = await dependencies.getTeamMemberByUserIdUseCase.execute({ userId });
                if (!teamMember?.teamId) {
                    return {
                        statusCode: 404,
                        body: { error: "No team associated with this user" },
                    };
                }
                teamId = teamMember.teamId;
            }
            const teamMembers = await dependencies.getTeamMembersUseCase.execute({
                teamId,
                userId,
            });
            return {
                statusCode: 200,
                body: teamMembers,
            };
        }
        catch (error) {
            return {
                statusCode: 400,
                body: { error },
            };
        }
    };
    const getTeamMemberByUserIdController = async (httpRequest) => {
        const userId = httpRequest.userId;
        if (!userId) {
            return {
                statusCode: 400,
                body: { error: "User ID is required" },
            };
        }
        try {
            const teamMember = await dependencies.getTeamMemberByUserIdUseCase.execute({
                userId,
            });
            if (!teamMember) {
                return {
                    statusCode: 404,
                    body: { error: "No team found for user" },
                };
            }
            return {
                statusCode: 200,
                body: teamMember,
            };
        }
        catch (error) {
            return {
                statusCode: 500,
                body: { error: "Server error" },
            };
        }
    };
    const updateTeamMemberSkillController = async (httpRequest) => {
        const teamId = httpRequest.params.teamId;
        const memberData = {
            ...httpRequest.body,
            userId: httpRequest.body.memberId,
            teamId: teamId,
        };
        try {
            if (!teamId) {
                return {
                    statusCode: 400,
                    body: { error: "Member ID is required" },
                };
            }
            const updatedMember = await dependencies.updateTeamMemberSkillUseCase.execute(memberData);
            return {
                statusCode: 200,
                body: updatedMember,
            };
        }
        catch (error) {
            return {
                statusCode: 500,
                body: { error: "Server error" },
            };
        }
    };
    const deleteTeamMemberController = async (httpRequest) => {
        const id = httpRequest.body.id;
        try {
            if (!id) {
                return {
                    statusCode: 400,
                    body: { error: "Team member does not exists." },
                };
            }
            const deletedTeamMember = await dependencies.deleteTeamMemberUseCase.execute(id);
            return {
                statusCode: 200,
                body: deletedTeamMember,
            };
        }
        catch (error) {
            return {
                statusCode: 500,
                body: { error: "Server error" },
            };
        }
    };
    return {
        createTeamMemberController,
        getTeamMembersByTeamIdController,
        getTeamMemberByUserIdController,
        updateTeamMemberSkillController,
        inviteOrSwitchTeamController,
        deleteTeamMemberController,
    };
};
const teamMemberController = createTeamMemberController({
    createTeamMemberUseCase: create_team_member_1.default,
    getTeamMembersUseCase: get_team_members_1.default,
    getTeamMemberByUserIdUseCase: get_team_member_by_user_id_1.default,
    updateTeamMemberSkillUseCase: update_team_member_skill_1.default,
    inviteOrSwitchTeamUseCase: invite_or_switch_team_1.default,
    deleteTeamMemberUseCase: delete_team_member_1.default,
});
exports.default = teamMemberController;
