Gitの使い方
=====

## 1. Gitって何さ?

> Gitは、プログラムのソースコードなどの変更履歴を記録・追跡するための分散型バージョン管理システムである。
> -[Wikipedia](https://ja.wikipedia.org/wiki/Git)

  要はチームでソフトウェアなどを開発する際に、一つのソースコードを分担して効率よく編集できるように管理するシステム。サーバに保存されたソースコードを手元のpcにコピーし編集、その変更をサーバに反映したり、誰かの変更を手元のコピーに反映したりできる。

  今回使うのはGitHub。これはGitを使ったオンラインのソースコード管理サービスである。
  GitHubは公開されているソースコードの閲覧やSNS機能も備えており、コード管理に限らず、ソースコードやソフトウェアの共有等にも使われていたりもする。

## 2. どうやって使えってのよ?
    
  ウェブブラウザ上でもファイルのアップロードや編集など行えるが、ここでは手元のPCにクローン(コピーすることって認識でOK)して利用する方法を説明仕様と思う。


### 2.1. 必要なものは?

- ネット環境とPC
    - これが見えているなら大丈夫なはず。当然PCから見ているよね?

- GitHubのアカウント
    - なければ[このページから](https://github.co.jp/)作成すること。"Choose your subscription" の項目は理由がなければ "Free" で。

- (Windowsの場合) Git Bash

    - [ここから](https://gitforwindows.org/)ダウンロードしてインストール。インストーラの画面ではNext連打でいいが、"Adjusting your PATH environment" の項目は "Use Git from Git Bash only" を選んでおくことを勧める。

- (mac、Linux系の場合) Git環境

    - ターミナルで `git --version` と打ち込んでバージョンを確認。最新バージョンは[ここ](https://git-scm.com/)で確認のこと。右のモニターの画像内にある数字が最新版。
    - macでは、Gitがインストールされていない場合コマンドライン・デベロッパー・ツールのインストールが促されるはず。その中にGitも含まれているため、問題なければそのままインストール。最新版にしたければ[ここから](https://git-scm.com/download/mac)インストーラを落として使うか、ターミナルで `brew install git` と打ち込む。(要Homebrew)
    -LinuxでGitがインストールされていなかった場合、`yum install git-core` (要yum)か `sudo apt-get install git` (UbuntuなどDebian系の環境)でインストールできるとか。


### 2.2. 何をすればいい?

  まずは初期設定。ターミナル (Windowsなら Git Bash) を起動。次のコマンドを実行。

    $ git config --global user.name "(ユーザー名)"
    $ git config --global user.email "(メールアドレス)"

  " $ " より右を入力。" $ " は入力しない。ユーザー名とメールアドレスは何でもよいが、GitHubに登録したものを使えば混乱しなくて済むかと。ここで設定した内容はホームディレクトリ直下にある `.gitconfig` に書き込まれているほか、以下のコマンドでも確認できる

    $ git config user.name
    $ git config user.email

  つぎにプロジェクトに招待してもらい、プッシュ等できるようにする。権限を持った人 (農革の代表さん) にGitHubのユーザー名を教えて、受け取った招待メールから承認すればOK。

  いよいよプロジェクトのリポジトリ (保管されたデータ) をPCにクローン (複製) する。次をターミナルに入力して実行すると、ホームディレクトリ (Windowsなら `C:\Users\(ユーザー名)`) の直下にNoukakuというディレクトリ (Windowsでいうフォルダ) ができ、リポジトリが複製される。場所が気に食わなければ`cd`や`ls`、`mkdir`などのコマンドを駆使して好きな位置に移動してから行えばよい。

    $ git clone https://github.com/seotok/Noukaku.git
  
  この中に共有したいファイルを入れたり、変更を加えていくことになる。

## 3. GitHub側のリポジトリに変更があったよ! PCのリポジトリに反映させたいんだけど?

  以下の手順で行う。

1. ターミナルを起動、cdコマンドでクローンしたディレクトリに移動。Windowsの場合ディレクトリ名の横に (master) などと書かれているはず。ここにはブランチ名 (多分後述する) が表示される。

2. 以下のコマンドを実行

`$ git pull`

  これでPCのリポジトリが最新の状態になる。

## 4. ファイルの追加や変更をGitHubに反映させるのはどうやんのさ?

  以下の手順で行う。事前に上記の`git pull`コマンドを行って、リポジトリを最新の状態にしておくとトラブル防止になる。

1. (ファイルをまだディレクトリに追加していない場合) クローンしたディレクトリ内 (今回の場合 "Noukaku" って名前になっているはず) に追加したいファイルを入れる。

2. ターミナルを起動、cdコマンドでクローンしたディレクトリに移動。Windowsの場合ディレクトリ名の横に (master) などと書かれているはず。ここにはブランチ名 ( [ここ](./HowToUseGitMore.md) 参照) が表示される。

3. 以下のコマンドを実行

`$ git add (追加、変更したファイルまたはディレクトリのアドレス)`

  アドレスに `.`を指定するとディレクトリ全体が指定される。

4. 続いて以下のコマンドを実行

`$ git commit -m "(コメント)"`

  `-a` オプションをつけると変更があったファイルすべてがコミット (GitHubに反映されるファイルとして指定) される。-m オプションとコメントを入力しないとvim等のエディタが起動してしまうため注意。特にWindowsの場合vimを終了させる方法が分かりづらいため気を付けること。Escキーを押してから `:wq` (入力を保存してから終了) か `:q!` (保存せずに終了) と入力する。

5. 最後に以下のコマンドを実行

`$ git push`

  これでGitHub側のリポジトリに反映される。pushするまでは反映されないので注意。

## 5. そのほかの機能は?

  [ここ](./HowToUseGitMore.md)に記載していく予定。トラブルシューティング的なことも書いていこうかなと考えている。



  なるべく丁寧に詳しく書いたつもりだが、もしわからないことがある場合は以下の参考資料集やGoogle先生などを使って調べるか、先輩方にでも聞いてね。



## 参考資料集
- Wikipedia
    - https://ja.wikipedia.org/wiki/Git
    - https://ja.wikipedia.org/wiki/GitHub
- Git
    - https://git-scm.com/
- Git for windows
    - https://gitforwindows.org/
- GitHub
    - https://github.co.jp/
- TECHACADEMY
    - https://techacademy.jp/magazine/6235
- 東京大学 佐々木淳 研究室 の記事
    - https://estuarine.jp/2018/09/gitlab-windows/
- Qiitaの@eyenerさんの記事
    - https://qiita.com/eyener/items/3fde597feda105eb61e6
- gihyo.jp
    - https://gihyo.jp/dev/serial/01/hackgirlsgit/0003
- Linux入門
    - https://linux.keicode.com/prog/git.php
- Ptogate
    - https://prog-8.com/docs/git-env-win
- Samurai Blog
    - https://www.sejuku.net/blog/72524
- バージョン管理システム入門
    - https://tracpath.com/bootcamp/git-install-to-mac.html
- Linux/Unix環境でのGit入門
    - http://www.aise.ics.saitama-u.ac.jp/~gotoh/IntroGitOnLinux.html
- 岩手大学 ソフトウェア設計及び演習のページ
    - http://wiki.cis.iwate-u.ac.jp/~yamanaka/csd/2019/material/gitlab/
- note.nkmk.me
    - https://note.nkmk.me/git-config-setting/