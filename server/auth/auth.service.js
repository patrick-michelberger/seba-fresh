var auth = {};

export function hasRole(roleRequired) {
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }
  return (req, res, next) => {
    next();
  };
};
