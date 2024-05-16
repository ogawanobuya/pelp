#!/bin/bash

readonly rules_dir='/firestore/rules'
readonly header_file='header.rules'
readonly footer_file='footer.rules'
readonly route_file='routes.rules'
readonly helper_file='helper.rules'
readonly funcs_dir='/functions'
readonly in_files=(
  'account.rules'
  'accountIndex.rules'
  'enterpriseUser.rules'
  'vendorUser.rules'
)
readonly out_file='/firestore/firestore.rules'

main() {
  readonly root_dir="./$(dirname $0)/.."

  readonly work_file='firestore.rules.work'
  touch $work_file

  cat "${root_dir}${rules_dir}/${header_file}" >> $work_file

  cat "${root_dir}${rules_dir}/${route_file}" | sed -e '/^$/d' | sed 's/^/    /g' >> $work_file
  echo >> $work_file

  for file in ${in_files[@]}; do
    echo "    // ${file} //" >> $work_file
    cat "${root_dir}${rules_dir}${funcs_dir}/${file}" | sed -e '/^$/d' | sed 's/^/    /g' >> $work_file
    echo >> $work_file
  done

  echo "    // ${helper_file} //" >> $work_file
  cat "${root_dir}${rules_dir}/${helper_file}" | sed -e '/^$/d' | sed 's/^/    /g' >> $work_file

  cat "${root_dir}${rules_dir}/${footer_file}" >> $work_file

  cat $work_file > "${root_dir}${out_file}"
  rm $work_file
}

main