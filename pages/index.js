import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers, providers } from "ethers";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  // Track if connected
  const [walletConnected, setWalletConnected] = useState(false);
  // Ref the Web3Modal
  const web3ModalRef = useRef();
  // The actual ENS
  const [ens, setENS] = useState("");
  // Save address sir
  const [address, setAddress] = useState("");

  /**
   * Set the ENS name of the account, or return the address itself
   */
  const setENSOrAddress = async (address, web3Provider) => {
    var _ens = await web3Provider.lookupAddress(address);
    if (_ens) {
      setENS(_ens);
    } else {
      setAddress(address);
    }
  };

  /**
   * Provider/Signer time e.g. read or read+write
   */
  const getProviderOrSigner = async () => {
    // Connect to 'Metamask'
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // Are you on Goerli anon?
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Get onto the Goerli network, anon");
      throw new Error("Get onto the Goerli network, anon");
    }
    const signer = web3Provider.getSigner();
    // Get address
    const address = await signer.getAddress();
    // Call function for the ENS name OR the address itself (see above)
    await setENSOrAddress(address, web3Provider);
    return signer;
  };

  /*
    Do the actual connect > Metamask
  */
  const connectWallet = async () => {
    try {
      // Ahhhh I'm providing
      await getProviderOrSigner(true);
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  /*
    Henlo, please render our things
  */
  const renderButton = () => {
    if (walletConnected) {
      <div>Wallet connected</div>;
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  // Check and call change
  useEffect(() => {
    // Sir, please connect
    if (!walletConnected) {
      // Assign Web3Modal (see above)
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Solidity ENS Connector</title>
        <meta name="description" content="Solidity ENS Connector" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <img className={styles.image} src="./silkweaveENSBG.png" />
        </div>
        <div>
          <h1 className={styles.title}>
            Welcome to the <strong>Solidity ENS Connector</strong>, anon {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            Not much is going on here, but hi anyway.
          </div>
          {renderButton()}
        </div>
      </div>

      <footer className={styles.footer}>
        Built by&nbsp;<a href="https://twitter.com/0xSilkweave" alt="Twitter of 0xSilkweave">0xSilkweave</a>!
      </footer>
    </div>
  );
}