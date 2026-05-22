export function handleError(err) {
  const status = err.response?.status;
  const message = err.response?.data?.message;

  if (status) {
    console.log(` [${status}] ${message}`);
  } else {
    console.log(` ${err.message}`);
  }
}


export const capitalize = str => str?.[0].toUpperCase() + str?.slice(1);