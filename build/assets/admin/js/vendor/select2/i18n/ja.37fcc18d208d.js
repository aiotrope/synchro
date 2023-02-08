/*! Select2 4.0.13 | https://github.com/select2/select2/blob/master/LICENSE.md */

!(function () {
  if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd)
    var n = jQuery.fn.select2.amd
  n.define('select2/i18n/ja', [], function () {
    return {
      errorLoading: function () {
        return '結果が読み込まれませんでした'
      },
      inputTooLong: function (n) {
        return n.input.length - n.maximum + ' 文字を削除してください'
      },
      inputTooShort: function (n) {
        return (
          '少なくとも ' +
          (n.minimum - n.input.length) +
          ' 文字を入力してください'
        )
      },
      loadingMore: function () {
        return '読み込み中…'
      },
      maximumSelected: function (n) {
        return n.maximum + ' 件しか選択できません'
      },
      noResults: function () {
        return '対象が見つかりません'
      },
      searching: function () {
        return '検索しています…'
      },
      removeAllItems: function () {
        return 'すべてのアイテムを削除'
      },
    }
  }),
    n.define,
    n.require
})()
