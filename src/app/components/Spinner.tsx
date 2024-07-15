
import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fontawesome from '@/(icons)/fontawesome';

const Spinner: React.FC = () => {
  return (
    <FontAwesomeIcon icon={fontawesome.faSpinner} spin />
  );
}

export default Spinner;
