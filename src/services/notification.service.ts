import axios from 'axios';


class NotificationService{
    /**
     * Posts a notification to the ntfy client
     * Markdown enabled
     * @param message 
     */
    async postNotification(message: string){
        try{
            if(!process.env.NTFY_TOPIC){
                console.log('NTFY_TOPIC environment variable not set');
                return;
            }

            await axios.post(process.env.NTFY_TOPIC as string, message, {
                headers :{
                    Title: 'New Order',
                    Tags: 'tada,cart',
                    Markdown: 'yes',
                }
            })
        } catch (error){
            console.log('Failed to send ntfy notification', error);
        }
    }
}

export default new NotificationService();