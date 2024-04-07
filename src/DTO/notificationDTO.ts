class NotificationDTO {
    // Define properties corresponding to the data fields
    public recipientId: string;
    public message:string
    public authorId:string
    public type:string
    // Constructor to initialize the DTO object with optional initial values
    constructor(recipientId: string,message:string,authorId:string,type:string) {
        this.recipientId = recipientId;
        this.message=message;
        this.authorId=authorId;
        this.type=type;
    }
}

export default NotificationDTO;