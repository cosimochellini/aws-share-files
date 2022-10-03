import { useForm } from 'react-hook-form';

import { UserEmail } from '../../types/dynamo.types';
import { Save } from '../../barrel/mui.icons.barrel';
import { LoadingButton } from '../Data/LoadingButton';
import { useEmailsStore } from '../../store/emails.store';
import {
  Card, CardContent, Checkbox, FormControlLabel, Grid, TextField,
} from '../../barrel/mui.barrel';

export function NewUserEmail() {
  const addEmail = useEmailsStore((x) => x.addEmail);

  const { register, handleSubmit, reset } = useForm<UserEmail>();

  const onSubmit = handleSubmit((email) => addEmail(email).then(() => reset()));

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item>
        <Card variant="outlined" sx={{ maxWidth: '30rem' }}>
          <CardContent>
            <form onSubmit={onSubmit}>
              <Grid container gap={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    {...register('email')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="email"
                    fullWidth
                    variant="outlined"
                    label="Description"
                    {...register('description')}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControlLabel
                    label="Default"
                    control={<Checkbox {...register('default')} />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <LoadingButton
                    text="save"
                    icon={<Save />}
                    buttonProps={{ variant: 'outlined' }}
                    clickAction={onSubmit}
                  />
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
