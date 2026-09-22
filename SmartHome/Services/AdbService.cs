using System.Diagnostics;

namespace SmartHome.Services
{
    public class AdbService
    {
        private readonly string _adbPath =
            @"C:\Users\Админ\Desktop\platform-tools-latest-windows\platform-tools\adb.exe";

        private readonly string _device =
            "192.168.8.8:5555";

        private Process? _adbProcess;

        public void Start()
        {
            _adbProcess = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = _adbPath,
                    Arguments = $"-s {_device} shell",
                    RedirectStandardInput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            _adbProcess.Start();
            _adbProcess.StandardInput.WriteLine("echo ready");
            _adbProcess.StandardInput.Flush();
        }

        //public void SendKey(int key)
        //{
        //    if (_adbProcess == null)
        //        return;

        //    _adbProcess.StandardInput.WriteLine($"input keyevent {key}");
        //    _adbProcess.StandardInput.Flush();
        //}

        public void SendKey(int key)
        {
            if (_adbProcess == null)
                return;

            var stopwatch = Stopwatch.StartNew();

            _adbProcess.StandardInput.WriteLine($"input keyevent {key}");
            _adbProcess.StandardInput.Flush();

            stopwatch.Stop();

            Console.WriteLine($"ADB: {stopwatch.ElapsedMilliseconds} ms");
        }
    }
}