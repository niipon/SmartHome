using System.Net.Sockets;


namespace SmartHome.Services;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;

public class TvRemoteService
{
    private readonly string _deviceIp = "192.168.8.8";

    private TcpClient? _client;
    private NetworkStream? _stream;
    private X509Certificate2? _clientCertificate;


    public async Task ConnectAsync()
    {
        _client = new TcpClient();

        await _client.ConnectAsync(
     _deviceIp,
     TvRemoteProtocol.RemotePort);

        _stream = _client.GetStream();



    }

    private X509Certificate2 CreateClientCertificate()
    {
        if (_clientCertificate != null)
            return _clientCertificate;

        using var rsa = RSA.Create(2048);

        var request = new CertificateRequest(
            "CN=AndroidTV Remote",
            rsa,
            HashAlgorithmName.SHA256,
            RSASignaturePadding.Pkcs1);

        request.CertificateExtensions.Add(
            new X509KeyUsageExtension(
                X509KeyUsageFlags.DigitalSignature |
                X509KeyUsageFlags.KeyEncipherment,
                true));

        request.CertificateExtensions.Add(
            new X509EnhancedKeyUsageExtension(
                new OidCollection
                {
                new Oid("1.3.6.1.5.5.7.3.2")
                },
                true));

        _clientCertificate = request.CreateSelfSigned(
            DateTimeOffset.UtcNow.AddDays(-1),
            DateTimeOffset.UtcNow.AddYears(1));

        return _clientCertificate;
    }

}