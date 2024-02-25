export default class ErrorService {
    handle(e: unknown): string {
      let message: string;
  
      if (e instanceof Error) {
        message = e.name + '-' + e.message;
      } else if (typeof e === 'string') {
        message = e;
      } else {
        message = "We don't know what the heck happened -- sorry!"
      }

      return message
    }
}
  