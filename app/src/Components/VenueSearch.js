import React from 'react';
import {
  Link
} from 'react-router-dom'
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';


function renderInput(inputProps) {
  const { InputProps, inputValue, searchVenue, classes, ref, ...other } = inputProps;
  return (
    <TextField
    	onChange={searchVenue(inputValue)}
      disableUnderline={true}
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}


function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.fields.name) > -1;
  return (
    <Link to={"/venues/" + suggestion.pk}><MenuItem
      {...itemProps}
      key={suggestion.fields.name}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
    {suggestion.fields.name}

    </MenuItem></Link>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

function getSuggestions(value, suggestions) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {

    	console.log(suggestion.fields.name.toLowerCase(), inputValue)

        const keep =
          count < 5 && suggestion.fields.name.toLowerCase().includes(inputValue);

        if (keep) {
          count += 1;
        }

        console.log(keep)
        return keep;
      });


}

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 50,
    width: 275,
    marginLeft: 20,
    marginRight: 20,
		top: 10,
    position: 'relative'
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
		backgroundColor: 'white',
    borderRadius: 5,
    color: '#464649',
    padding: 7,
    width: 'auto',
    flexGrow: 1,

    '&::placeholder': {
      color: '#464649',
      opacity: '1 !important'
    },

  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});


function IntegrationDownshift(props) {
  const { classes, suggestions, searchVenue } = props;

  return (
    <div className={classes.root}>
      <Downshift id="downshift-simple">
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          highlightedIndex,
          inputValue,
          isOpen,
          selectedItem,
        }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              inputValue,
              searchVenue,
              InputProps: getInputProps({
                placeholder: 'Search a venue',
              }),
            })}
            <div {...getMenuProps()}>
              {isOpen ? (
                <Paper className={classes.paper} square>
                  {getSuggestions(inputValue, suggestions).map((suggestion, index) =>

                    renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({ item: suggestion.fields.name }),
                      highlightedIndex,
                      selectedItem,
                    }),

                  )}
                </Paper>
              ) : null}
            </div>
          </div>
        )}
      </Downshift>

    </div>
  );
}

IntegrationDownshift.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IntegrationDownshift);
