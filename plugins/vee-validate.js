import { extend } from "vee-validate";
import { required,email } from "vee-validate/dist/rules";

extend('required', {
  validate(value) {
    return {
      required: true,
      valid: ['', null, undefined].indexOf(value) === -1,
    }
  },
  message: 'This field is required',
  computesRequired: true,
})

extend("email", email)


extend('min', {
  validate(value, args) {
    if(value.length >= args.length){
      return true
    }else{
      return `minimum ${args.length} characters`
    }
  },
  params: ['length']
});

extend('max', {
  validate(value, args) {
    if(value.length <= args.length){
      return true
    }else{
      return `maximum ${args.length} characters`
    }
  },
  params: ['length']
});

extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: 'Password confirmation does not match'
});
