import { Save } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { UserEmail } from "../../types/dynamo.types";
import { functions } from "../../instances/functions";
import { notification } from "../../instances/notification";
import { FormControlLabel, Grid, TextField } from "@mui/material";
import { Button, Card, CardContent, Checkbox } from "@mui/material";
import { useUserEmail } from "../../hooks/state/useUserEmail.state";

export function NewUserEmail() {
  const { register, handleSubmit, reset } = useForm<UserEmail>();
  const { refreshEmails } = useUserEmail();

  const onSubmit = handleSubmit((data: UserEmail) => {
    functions.email
      .addEmail(data)
      .then(() => {
        reset();
        refreshEmails();
      })
      .catch(notification.error);
  });

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item>
        <Card variant="outlined" sx={{ maxWidth: "30rem" }}>
          <CardContent>
            <form onSubmit={onSubmit}>
              <Grid container gap={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type={"email"}
                    variant="outlined"
                    fullWidth
                    {...register("email")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type={"email"}
                    fullWidth
                    variant="outlined"
                    label="Description"
                    {...register("description")}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControlLabel
                    label="Default"
                    control={<Checkbox {...register("default")} />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    onClick={onSubmit}
                    endIcon={<Save />}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
