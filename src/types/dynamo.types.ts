interface BaseDynamoItem {
    pk: string;
    sk: string;
}

export interface UserEmail extends BaseDynamoItem {
    /**
    * The email address of the user that added the email address.
    */
    user: string;
    /**
    * The email address that was added.
    */
    email: string;
    /**
    * A small description of the email address.
    */
    description: string;
    /**
    * If the email should be seen as primary.
    */
    default: boolean;
}
