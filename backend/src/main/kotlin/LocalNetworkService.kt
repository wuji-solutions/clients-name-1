import org.springframework.stereotype.Service
import java.net.InetAddress

@Service
class LocalNetworkService {
    fun getLocalIP(): String = InetAddress.getLocalHost().hostAddress
}