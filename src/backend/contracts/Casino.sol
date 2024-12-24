/*
*██████╗░░█████╗░██╗░░░██╗██╗░░░░░███████╗████████╗████████╗███████╗
*██╔══██╗██╔══██╗██║░░░██║██║░░░░░██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝
*██████╔╝██║░░██║██║░░░██║██║░░░░░█████╗░░░░░██║░░░░░░██║░░░█████╗░░
*██╔══██╗██║░░██║██║░░░██║██║░░░░░██╔══╝░░░░░██║░░░░░░██║░░░██╔══╝░░
*██║░░██║╚█████╔╝╚██████╔╝███████╗███████╗░░░██║░░░░░░██║░░░███████╗
*╚═╝░░╚═╝░╚════╝░░╚═════╝░╚══════╝╚══════╝░░░╚═╝░░░░░░╚═╝░░░╚══════╝
*/
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Ownable.sol";
import "./Token.sol";

contract Roulette is Ownable{

    event RouletteGame (
        uint NumberWin,
        bool result,
        uint tokensEarned
    );

    ERC20 private token;
    address public tokenAddress;

    function precioTokens(uint256 _numTokens) public pure returns (uint256){
        return _numTokens * (0.001 ether);
    }

    function tokenBalance(address _of) public view returns (uint256){
        return token.balanceOf(_of);
    }
    constructor(address initialOwner) Ownable(initialOwner) {
        token =  new ERC20("CHIPS", "chips");
        tokenAddress = address(token);
        token.mint(100000000);
    }

    // Visualizacion del balance de ethers del Smart Contract
    function balanceEthersSC() public view returns (uint256){
        return address(this).balance / 10**18;
    }

    function getAdress() public view returns (address){
        return address(token);

    }

     function compraTokens(uint256 _numTokens) public payable{
		// User registration
        // Establishment of the cost of the tokens to be purchased
        // Evaluation of the money that the client pays for the tokens
        require(msg.value >= precioTokens(_numTokens), "Compra menos tokens o paga con mas ethers");
        // Creation of new tokens in case there is not enough supply
        if  (token.balanceOf(address(this)) < _numTokens){
            token.mint(_numTokens*100000);
        }
		 // Refund of excess money
        // Smart Contract returns the remaining amount
        payable(msg.sender).transfer(msg.value - precioTokens(_numTokens));
        // Envio de los tokens al cliente/usuario
        token.transfer(address(this), msg.sender, _numTokens);
    }

    // Return of tokens to the Smart Contract
    function devolverTokens(uint _numTokens) public payable {
        // The number of tokens must be greater than 0
        require(_numTokens > 0, "Necesitas devolver un numero de tokens mayor a 0");
        // The user must prove they have the tokens they want to return
        require(_numTokens <= token.balanceOf(msg.sender), "No tienes los tokens que deseas devolver");
        // The user transfers the tokens to the Smart Contract
        token.transfer(msg.sender, address(this), _numTokens);
        // The Smart Contract sends the ethers to the user
        payable(msg.sender).transfer(precioTokens(_numTokens)); 
    }

    struct Bet {
        uint tokensBet;
        uint tokensEarned;
        string game;
    }

    struct RouleteResult {
        uint NumberWin;
        bool result;
        uint tokensEarned;
    }

    mapping(address => Bet []) historialApuestas;

    function retirarEth(uint _numEther) public payable onlyOwner {
        // El numero de tokens debe ser mayor a 0
        require(_numEther > 0, "Necesitas devolver un numero de tokens mayor a 0");
        // El usuario debe acreditar tener los tokens que quiere devolver
        require(_numEther <= balanceEthersSC(), "No tienes los tokens que deseas devolver");
        // Transfiere los ethers solicitados al owner del smart contract'
        payable(owner()).transfer(_numEther);
    }

    function tuHistorial(address _propietario) public view returns(Bet [] memory){
        return historialApuestas[_propietario];
    }

    function jugarRuleta(uint _start, uint _end, uint _tokensBet) public{
        require(_tokensBet <= token.balanceOf(msg.sender));
        require(_tokensBet > 0);
        uint random = uint(uint(keccak256(abi.encodePacked(block.timestamp))) % 14);
        uint tokensEarned = 0;
        bool win = false;
        token.transfer(msg.sender, address(this), _tokensBet);
        if ((random <= _end) && (random >= _start)) {
            win = true;
            if (random == 0) {
                tokensEarned = _tokensBet*14;
            } else {
                tokensEarned = _tokensBet * 2;
            }
            if  (token.balanceOf(address(this)) < tokensEarned){
            token.mint(tokensEarned*100000);
            }
            token.transfer( address(this), msg.sender, tokensEarned);
        }
            addHistorial("Roulete", _tokensBet, tokensEarned, msg.sender);
            emit RouletteGame(random, win, tokensEarned);
    }

    function addHistorial(string memory _game, uint _tokensBet,  uint _tokenEarned, address caller) internal{
        Bet memory apuesta = Bet(_tokensBet, _tokenEarned, _game);
        historialApuestas[caller].push(apuesta);
    }
	function withdrawAllETH() external onlyOwner {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "Contract has no Ether balance");
        payable(owner()).transfer(contractBalance);
    }
}