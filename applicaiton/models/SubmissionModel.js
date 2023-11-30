import { DataTypes, UUIDV4 } from "sequelize";

const submissionModel = (sequelize) => {
    let Submission = sequelize.define('submission', {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        assignment_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        submission_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        submission_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        submission_updated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        timestamps: false
    });

    return Submission;
}

export default submissionModel;
