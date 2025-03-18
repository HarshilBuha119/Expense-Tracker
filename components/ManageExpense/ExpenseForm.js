import { useState } from 'react';
import { StyleSheet, Text, View ,Pressable} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Input from './Input';
import Button from '../UI/Button';
import { getFormattedDate } from '../../util/date';
import { GlobalStyles } from '../../constants/styles';

function ExpenseForm({ submitButtonLabel, onCancel, onSubmit, defaultValues }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [inputs, setInputs] = useState({
    amount: {
      value: defaultValues ? defaultValues.amount.toString() : '',
      isValid: true,
    },
    date: {
      value: defaultValues ? new Date(defaultValues.date) : new Date(),
      isValid: true,
    },
    description: {
      value: defaultValues ? defaultValues.description : '',
      isValid: true,
    },
  });
  
  function dateChangeHandler(event, selectedDate) {
    const currentDate = selectedDate || inputs.date.value;
    setShowDatePicker(false);
    setInputs((curInputs) => {
      return {
        ...curInputs,
        date: { 
          value: currentDate instanceof Date ? currentDate : new Date(currentDate), 
          isValid: true 
        },
      };
    });
  }

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  function dateChangeHandler(event, selectedDate) {
    const currentDate = selectedDate || inputs.date.value;
    setShowDatePicker(false);
    setInputs((curInputs) => {
      return {
        ...curInputs,
        date: { value: currentDate, isValid: true },
      };
    });
  }

  function showDatePickerHandler() {
    setShowDatePicker(true);
  }

  function submitHandler() {
    const expenseData = {
      amount: +inputs.amount.value,
      date: new Date(inputs.date.value),
      description: inputs.description.value,
    };

    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const dateIsValid = expenseData.date.toString() !== 'Invalid Date';
    const descriptionIsValid = expenseData.description.trim().length > 0;

    if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
      setInputs((curInputs) => {
        return {
          amount: { value: curInputs.amount.value, isValid: amountIsValid },
          date: { value: curInputs.date.value, isValid: dateIsValid },
          description: {
            value: curInputs.description.value,
            isValid: descriptionIsValid,
          },
        };
      });
      return;
    }

    onSubmit(expenseData);
  }

  const formIsInvalid =
    !inputs.amount.isValid ||
    !inputs.date.isValid ||
    !inputs.description.isValid;

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Your Expense</Text>
      <View style={styles.inputsRow}>
        <Input
          style={styles.rowInput}
          label="Amount"
          invalid={!inputs.amount.isValid}
          textInputConfig={{
            keyboardType: 'decimal-pad',
            onChangeText: inputChangedHandler.bind(this, 'amount'),
            value: inputs.amount.value,
          }}
        />
        <View style={styles.rowInput}>
          <Text style={styles.label}>Date</Text>
          <Pressable onPress={showDatePickerHandler}>
            <View style={[
              styles.dateInput,
              !inputs.date.isValid && styles.invalidInput
            ]}>
              <Text style={styles.dateText}>
                {getFormattedDate(inputs.date.value)}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
      {showDatePicker && (
  <DateTimePicker
    value={inputs.date.value instanceof Date ? inputs.date.value : new Date()}
    mode="date"
    onChange={dateChangeHandler}
  />
)}
      <Input
        label="Description"
        invalid={!inputs.description.isValid}
        textInputConfig={{
          multiline: true,
          // autoCapitalize: 'none'
          // autoCorrect: false // default is true
          onChangeText: inputChangedHandler.bind(this, 'description'),
          value: inputs.description.value,
        }}
      />
      {formIsInvalid && (
        <Text style={styles.errorText}>
          Invalid input values - please check your entered data!
        </Text>
      )}
      <View style={styles.buttons}>
        <Button style={styles.button} mode="flat" onPress={onCancel}>
          Cancel
        </Button>
        <Button style={styles.button} onPress={submitHandler}>
          {submitButtonLabel}
        </Button>
      </View>
    </View>
  );
}

export default ExpenseForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 24,
    textAlign: 'center',
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowInput: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: GlobalStyles.colors.primary100,
    marginBottom: 4,
    marginTop:8,
  },
  dateInput: {
    backgroundColor: GlobalStyles.colors.primary100,
    padding: 6.9,
    borderRadius: 6,
    fontSize: 18,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary100,
  },
  invalidInput: {
    backgroundColor: GlobalStyles.colors.error50,
    borderColor: GlobalStyles.colors.error500,
  },
  dateText: {
    color: GlobalStyles.colors.primary700,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    color: GlobalStyles.colors.error500,
    margin: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});
