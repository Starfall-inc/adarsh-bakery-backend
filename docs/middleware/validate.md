## Validation Middleware (`src/middlewares/validate.middleware.ts`)

This middleware is responsible for validating incoming request data (body, query, params) against a provided Zod schema. It ensures that the data conforms to the expected structure and types before reaching the controller.

### Usage

```typescript
import validate from '../middlewares/validate.middleware';
import { someSchema } from '../schemas/validate.schema';

router.post('/', validate(someSchema), someController.someMethod);
```

### How it Works

1.  Takes a Zod schema as an argument.
2.  Parses the `req.body`, `req.query`, and `req.params` against the provided schema.
3.  If validation is successful, it calls `next()` to pass control to the next middleware or route handler.
4.  If validation fails, it catches the Zod error and sends a `400 Bad Request` response with the validation errors.
