const path = require('path'); // Импортируем модуль "path" для работы с путями файлов
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: './src/main.js', // Точка входа для сборки проекта
  output: {
    filename: 'bundle.[contenthash].js', // Имя выходного файла сборки
    path: path.resolve(__dirname, 'build'), // Путь для выходного файла сборки
    clean: {
        // сохранение файлов
        keep: /\ignored\/dir\//
      }
  },

  module: {
    rules: [
      {
        test: /\.css$/, // Регулярное выражение для обработки файлов с расширением .css
        use: ['style-loader', 'css-loader'], // Загрузчики, используемые для обработки CSS-файлов
      },
    ],
  },

  module: {
    rules: [
      {
        test: /\.js$/, // применять загрузчик только к файлам .js
        exclude: /node_modules/, // не применять загрузчик к файлам в папке node_modules
        use: {
          loader: 'babel-loader',
          //options: {
            //presets: ['@babel/preset-env']
          //}
        }
      }
    ]
  },

  devtool: 'source-map', // Здесь задаем создание карт
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: { sourceMaps: true } // Командуем Babel создавать карты
      }
    }]},

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      ignore: ['index.html']
    }),
    new CopyWebpackPlugin({
      patterns: [
      {
        from: path.resolve(__dirname, './src/public'),
        to: path.resolve(__dirname, './src/build')
      }
    ]})
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Каталог для статики
    },
    open: true, // Автоматически открывать браузер
  },

  mode: 'development', // Режим сборки
};