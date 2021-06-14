import React from "react";
import Swal from "sweetalert2";

export const SweetAlert2_Success = () => {
  Swal.fire({
    position: 'center-center',
    icon: 'success',
    title: 'Your work has been saved',
    showConfirmButton: false,
    timer: 1500
  })
};

export const SweetAlert2_Warning = () => {
  Swal.fire({
    position: 'center-center',
    icon: 'warning',
    title: 'Your work has been Duplicated',
    showConfirmButton: false,
    timer: 1500
  })
};

export const SweetAlert2_Error = () => {
  Swal.fire({
    position: 'center-center',
    icon: 'error',
    title: 'Your work has been Error',
    showConfirmButton: false,
    timer: 1500
  })
};
