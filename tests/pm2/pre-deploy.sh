APP_DIR=/home/ec2-user/kogo/kogo-cms
ARCHIVE_DIR=/home/ec2-user/kogo/archive

NOW=$(TZ=PST date "+%Y-%m-%d")

TARGET=${ARCHIVE_DIR}/kogo-cms-${NOW}

if [ -d "$APP_DIR" ]; then
  echo "[PRE-DEPLOY] Found existing app in ${APP_DIR}, archive the version in ${ARCHIVE_DIR}"

  if [ -d "$TARGET" ] ; then
    i=1
    NAME=${TARGET}-${i}
    while [ -d "$NAME" ] ; do
      let i++
      NAME=${TARGET}-${i}
    done
    TARGET=${NAME}
  fi
  mv $APP_DIR $TARGET
fi
