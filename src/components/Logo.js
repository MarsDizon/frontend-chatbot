import PropTypes from 'prop-types';
// material
import { Box } from '@mui/material';
import SpeciaLogo from "../assets/SpeciaLogo.png";

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return <Box component="img" src={SpeciaLogo} sx={{ width: 40, height: 40, ...sx }} />;
}
