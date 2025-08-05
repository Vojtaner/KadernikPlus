"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_team_by_id_1 = __importDefault(require("../../application/use-cases/team/get-team-by-id"));
const createTeamController = (dependencies) => {
    const getTeamController = async (httpRequest) => {
        const teamId = httpRequest.params.teamId;
        const team = await dependencies.getTeamByIdUseCase.execute({
            teamId,
        });
        if (!team) {
            return {
                statusCode: 404,
                body: { error: "Team not found" },
            };
        }
        return {
            statusCode: 200,
            body: team,
        };
    };
    return {
        getTeamController,
    };
};
const teamController = createTeamController({
    getTeamByIdUseCase: get_team_by_id_1.default,
});
exports.default = teamController;
