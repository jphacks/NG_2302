import speech_recognition as sr
import subprocess

def main():
    recognizer = sr.Recognizer()

    # システムを起動させるためのワードを格納する
    boot_word = 'あいうえお'

    with sr.Microphone() as source:
        print("【あいうえお】を待機しています...")
        audio = recognizer.listen(source)

    try:
        # 音声認識を実行して、認識したテキストとして変数に格納する
        recognized_text = recognizer.recognize_google(audio, language='ja-JP')

        print("認識結果:", recognized_text)

        # 認識した音声と設定したboot_wordが一致するか判定。一致したときは「audio_2.py」を実行する。
        if boot_word in recognized_text:
            print("match")
            subprocess.run(["python", "audio_2.py"])
        else:
            print("not match")
    

    # エラー処理
    except sr.UnknownValueError:
        print("音声を認識出来ませんでした。")
    except sr.RequestError as e:
        print(f"Google Web Speech APIにアクセス出来ませんでした: {e}")

if __name__ == "__main__":
    main()
