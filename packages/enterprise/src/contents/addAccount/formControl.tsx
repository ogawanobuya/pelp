import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  styled,
  Typography
} from '@mui/material';

const FormControlWrapper = styled(FormControl)(
  () => `
    max-width: 800px;
`
);

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
`
);

interface AddAccountContentFormControlProps {
  type?: string;
  title: string;
  error?: boolean;
  placeholder: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  icon: React.ReactNode;
}
const AddAccountContentFormControl = (
  props: AddAccountContentFormControlProps
) => {
  const { type, error, placeholder, value, onChange, icon, title } = props;
  return (
    <FormControlWrapper variant="outlined" fullWidth>
      <Typography variant="h5" align="left" sx={{ my: 1 }}>
        {title}
      </Typography>
      <OutlinedInputWrapper
        type={type ?? 'text'}
        placeholder={placeholder}
        error={error ?? false}
        value={value}
        onChange={onChange}
        startAdornment={
          <InputAdornment position="start">{icon}</InputAdornment>
        }
      />
    </FormControlWrapper>
  );
};

export default AddAccountContentFormControl;