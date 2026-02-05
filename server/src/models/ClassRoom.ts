import mongoose,{Schema,Document,Types} from "mongoose";

export interface ITasks {
    type: "quiz"|"flashcard"|"audio"|"texto",
    content:string,
    correction:string,
    completed:boolean,
};

const TaskSchema : Schema = new Schema({
    type:{
        type:String,
        enum:["quiz","flashcard","audio","texto"],
        required:true
    },
    content:{type:String, required:true},
    correction:{type:String, default:""},
    completed:{type:Boolean, default:false},
});



export interface IClassroom extends Document{
    name:String,
    TeacherId:Types.ObjectId;
    StudentId:Types.ObjectId;
    tasks:ITasks[];
    active:Boolean
};

const ClassroomSchema: Schema = new Schema({
    name:{type:String, required:true},
    TeacherId:{type: Schema.Types.ObjectId, ref:"User", required:true},
    StudentId:{type: Schema.Types.ObjectId, ref:"User", required:true},

    tasks:[TaskSchema],

    active:{type:Boolean, default:true}
},{timestamps:true});

export default mongoose.model<IClassroom>("classroom", ClassroomSchema)