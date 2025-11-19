import theme from "../common/theme";

export default function Divider() {
  return (
    <div
      style={{
        borderTop: `4px solid ${theme.palette.main.accent}`,
        width: '100%',
      }}
    />
  );
}
